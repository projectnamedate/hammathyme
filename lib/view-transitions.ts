/**
 * Thin wrapper around the native View Transitions API. Falls back to a plain
 * callback invocation on browsers that don't support it (older Firefox/Safari
 * pre-2025).
 *
 * Use it in any client-side router callback to wrap the DOM update; CSS
 * defines the actual cinnamon curtain transition via ::view-transition-*
 * pseudo-elements in app/globals.css.
 */

export function startTransition(updateDom: () => void | Promise<void>) {
  if (typeof document === "undefined") return;
  if (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.startViewTransition(updateDom);
  } else {
    updateDom();
  }
}

export function supportsViewTransitions(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  );
}
