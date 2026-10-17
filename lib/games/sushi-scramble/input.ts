// Keyboard + mouse (pointer lock) and twin-stick touch, read once per simulation step.
export type InputFrame = {
  moveX: number; // strafe, -1 left .. 1 right
  moveY: number; // forward, -1 back .. 1 forward
  lookX: number; // radians this step
  lookY: number;
  fire: boolean;
  aim: boolean;
  sprint: boolean;
  jump: boolean; // edges: true for one step
  grenade: boolean;
  reload: boolean;
  pause: boolean;
  mute: boolean;
};

export type Input = {
  read: () => InputFrame;
  locked: () => boolean;
  requestLock: () => void;
  touch: boolean;
  dispose: () => void;
};

const KEYS = { forward: ["KeyW", "ArrowUp"], back: ["KeyS", "ArrowDown"], left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"] };

export function createInput(surface: HTMLElement, sensitivity: number, touchUi: HTMLElement | null): Input {
  const down = new Set<string>();
  let lookX = 0;
  let lookY = 0;
  let fire = false;
  let aim = false;
  const edges = { jump: false, grenade: false, reload: false, pause: false, mute: false };
  const touch = matchMedia("(pointer: coarse)").matches;

  const onKey = (e: KeyboardEvent, isDown: boolean) => {
    if (isDown) {
      if (e.code === "Space" && !down.has("Space")) edges.jump = true;
      if ((e.code === "KeyG" || e.code === "KeyQ") && !down.has(e.code)) edges.grenade = true;
      if (e.code === "KeyR" && !down.has("KeyR")) edges.reload = true;
      if (e.code === "KeyM" && !down.has("KeyM")) edges.mute = true;
      if ((e.code === "Escape" || e.code === "KeyP") && !down.has(e.code)) edges.pause = true;
      down.add(e.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code) && document.pointerLockElement === surface) e.preventDefault();
    } else down.delete(e.code);
  };
  const keydown = (e: KeyboardEvent) => onKey(e, true);
  const keyup = (e: KeyboardEvent) => onKey(e, false);
  const mousemove = (e: MouseEvent) => {
    if (document.pointerLockElement !== surface) return;
    lookX -= e.movementX * sensitivity;
    lookY -= e.movementY * sensitivity;
  };
  const mousedown = (e: MouseEvent) => {
    if (document.pointerLockElement !== surface) return;
    if (e.button === 0) fire = true;
    if (e.button === 2) aim = true;
  };
  const mouseup = (e: MouseEvent) => {
    if (e.button === 0) fire = false;
    if (e.button === 2) aim = false;
  };
  const contextmenu = (e: Event) => e.preventDefault();
  const lockchange = () => {
    if (document.pointerLockElement !== surface) {
      fire = false;
      aim = false;
      down.clear();
    }
  };
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  window.addEventListener("mousemove", mousemove);
  surface.addEventListener("mousedown", mousedown);
  window.addEventListener("mouseup", mouseup);
  surface.addEventListener("contextmenu", contextmenu);
  document.addEventListener("pointerlockchange", lockchange);

  // Touch: the left half is a floating move stick, the right half drags the view; buttons are in the HUD.
  let stick: { id: number; x: number; y: number } | null = null;
  let stickX = 0;
  let stickY = 0;
  let lookTouch: { id: number; x: number; y: number } | null = null;
  const touchSens = sensitivity * 2.2;
  const tstart = (e: TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      const target = t.target as HTMLElement;
      if (target.closest("[data-touch-button]")) continue;
      const rect = surface.getBoundingClientRect();
      if (t.clientX - rect.left < rect.width / 2 && !stick) stick = { id: t.identifier, x: t.clientX, y: t.clientY };
      else if (!lookTouch) lookTouch = { id: t.identifier, x: t.clientX, y: t.clientY };
    }
  };
  const tmove = (e: TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (stick && t.identifier === stick.id) {
        stickX = Math.max(-1, Math.min(1, (t.clientX - stick.x) / 50));
        stickY = Math.max(-1, Math.min(1, -(t.clientY - stick.y) / 50));
      } else if (lookTouch && t.identifier === lookTouch.id) {
        lookX -= (t.clientX - lookTouch.x) * touchSens;
        lookY -= (t.clientY - lookTouch.y) * touchSens;
        lookTouch.x = t.clientX;
        lookTouch.y = t.clientY;
      }
    }
    e.preventDefault();
  };
  const tend = (e: TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (stick && t.identifier === stick.id) {
        stick = null;
        stickX = stickY = 0;
      }
      if (lookTouch && t.identifier === lookTouch.id) lookTouch = null;
    }
  };
  surface.addEventListener("touchstart", tstart, { passive: true });
  surface.addEventListener("touchmove", tmove, { passive: false });
  surface.addEventListener("touchend", tend);
  surface.addEventListener("touchcancel", tend);
  const buttons: [string, () => void, () => void][] = [
    ["fire", () => (fire = true), () => (fire = false)],
    ["jump", () => (edges.jump = true), () => {}],
    ["grenade", () => (edges.grenade = true), () => {}],
    ["aim", () => (aim = !aim), () => {}],
  ];
  const buttonListeners: [HTMLElement, string, EventListener][] = [];
  if (touchUi) {
    for (const [name, press, release] of buttons) {
      const el = touchUi.querySelector<HTMLElement>(`[data-touch-button="${name}"]`);
      if (!el) continue;
      const p: EventListener = (e) => {
        e.preventDefault();
        press();
      };
      const r: EventListener = () => release();
      el.addEventListener("touchstart", p, { passive: false });
      el.addEventListener("touchend", r);
      buttonListeners.push([el, "touchstart", p], [el, "touchend", r]);
    }
  }

  const held = (codes: string[]) => codes.some((c) => down.has(c));
  return {
    touch,
    locked: () => document.pointerLockElement === surface,
    requestLock: () => {
      // Chrome returns a promise that rejects outside a user gesture; the next click on the canvas locks instead.
      if (!touch && document.pointerLockElement !== surface) (surface.requestPointerLock?.() as Promise<void> | undefined)?.catch?.(() => {});
    },
    read: () => {
      let moveX = (held(KEYS.right) ? 1 : 0) - (held(KEYS.left) ? 1 : 0);
      let moveY = (held(KEYS.forward) ? 1 : 0) - (held(KEYS.back) ? 1 : 0);
      if (stickX || stickY) {
        moveX = stickX;
        moveY = stickY;
      }
      const frame: InputFrame = {
        moveX,
        moveY,
        lookX,
        lookY,
        fire,
        aim,
        sprint: down.has("ShiftLeft") || down.has("ShiftRight") || Math.hypot(stickX, stickY) > 0.92,
        jump: edges.jump,
        grenade: edges.grenade,
        reload: edges.reload,
        pause: edges.pause,
        mute: edges.mute,
      };
      lookX = lookY = 0;
      edges.jump = edges.grenade = edges.reload = edges.pause = edges.mute = false;
      return frame;
    },
    dispose: () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("mousemove", mousemove);
      surface.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mouseup", mouseup);
      surface.removeEventListener("contextmenu", contextmenu);
      document.removeEventListener("pointerlockchange", lockchange);
      surface.removeEventListener("touchstart", tstart);
      surface.removeEventListener("touchmove", tmove);
      surface.removeEventListener("touchend", tend);
      surface.removeEventListener("touchcancel", tend);
      buttonListeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
      if (document.pointerLockElement === surface) document.exitPointerLock();
    },
  };
}
