"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Vec3 = [number, number, number];

type Props = {
  src: string;
  poster: string;
  posterAlt: string;
  camera: Vec3;
  target: Vec3;
  fov: number;
};

type State = "poster" | "loading" | "live" | "unsupported";

// three and Spark (~1 MB gzipped) load only after the visitor asks for the 3D view.
export function SplatViewer({ src, poster, posterAlt, camera, target, fov }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>("poster");
  const requested = state !== "poster";

  useEffect(() => {
    if (!requested) return;
    const mount = mountRef.current;
    if (!mount) return;
    if (!document.createElement("canvas").getContext("webgl2")) {
      setState("unsupported");
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { SparkRenderer, SplatMesh } = await import("@sparkjsdev/spark");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.className = "block h-full w-full touch-none";

      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(fov, 1, 0.1, 2000);
      cam.position.set(...camera);
      scene.add(new SparkRenderer({ renderer }));

      // Brush exports in the Blender scene's Z-up frame; three is Y-up.
      const splat = new SplatMesh({ url: src });
      splat.rotation.x = -Math.PI / 2;
      scene.add(splat);

      const controls = new OrbitControls(cam, renderer.domElement);
      controls.target.set(...target);
      controls.enableDamping = true;
      controls.minDistance = 6;
      controls.maxDistance = 70;
      controls.maxPolarAngle = Math.PI * 0.47;
      controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      controls.autoRotateSpeed = 0.35;
      controls.addEventListener("start", () => {
        controls.autoRotate = false;
      });

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        renderer.setSize(width, height, false);
        cam.aspect = width / Math.max(height, 1);
        cam.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      cleanup = () => {
        observer.disconnect();
        renderer.setAnimationLoop(null);
        controls.dispose();
        splat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
      resize();

      await splat.initialized;
      if (disposed) return;
      setState("live");
      renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, cam);
      });
    })().catch((error) => {
      console.error("splat viewer failed", error);
      if (!disposed) setState("unsupported");
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [requested, src, camera, target, fov]);

  const showPoster = state !== "live";

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[linear-gradient(180deg,#D3A97E_0%,#F2D9BA_100%)]">
      <div ref={mountRef} className="absolute inset-0" />
      {showPoster ? (
        <Image
          src={poster}
          alt={posterAlt}
          fill
          sizes="(min-width: 768px) 75vw, 100vw"
          className="object-cover"
          priority
        />
      ) : null}
      {state === "poster" || state === "loading" ? (
        <button
          type="button"
          onClick={() => setState("loading")}
          disabled={state === "loading"}
          data-cursor="link"
          className="absolute bottom-4 left-4 border border-[var(--cream-0)] bg-[rgba(31,7,7,0.55)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cream-0)] backdrop-blur-sm transition-colors hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)] disabled:opacity-70"
        >
          {state === "loading" ? "loading splat…" : "explore in 3d"}
        </button>
      ) : null}
    </div>
  );
}
