"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_mobile;

vec3 cream = vec3(0.980, 0.933, 0.914);
vec3 rose = vec3(0.949, 0.867, 0.831);
vec3 deepRose = vec3(0.898, 0.749, 0.706);
vec3 cinnamon = vec3(0.949, 0.557, 0.525);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  vec2 p = uv - vec2(0.5 * u_resolution.x / u_resolution.y, 0.5);
  float t = u_time * 0.16;
  vec2 q = rotate(0.4 + sin(t) * 0.12) * p;

  float n = noise(q * 2.6 + vec2(t, -t * 0.4));
  n += 0.52 * noise(q * 5.4 - vec2(t * 0.7, t * 0.6));

  float ribbons = sin(
    (q.x + n * 0.52) * 7.2 + sin(q.y * 6.0 - t) * 1.8 + t * 2.2
  );
  float body = smoothstep(-0.15, 0.95, ribbons + n * 0.9);
  float glow = smoothstep(0.18, 0.92, noise(q * 3.0 + vec2(-t * 0.6, t)));

  float mobileLift = smoothstep(0.0, 1.0, u_mobile);
  vec3 color = mix(cream, rose, body * mix(0.72, 0.84, mobileLift));
  color = mix(color, cinnamon, glow * mix(0.34, 0.52, mobileLift));
  color = mix(color, deepRose, body * glow * mix(0.22, 0.34, mobileLift));

  float vignette = 1.0 - smoothstep(0.62, 1.28, length(p));
  float alpha = (0.74 + body * 0.12 + glow * 0.12) * (0.82 + vignette * 0.18);
  alpha = min(alpha * mix(1.0, 1.12, mobileLift), 0.98);
  gl_FragColor = vec4(color, alpha);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function AmbientShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobileMedia = window.matchMedia(
      "(max-width: 768px), (pointer: coarse)",
    );

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      canvas.dataset.ambientShaderState = "fallback";
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      canvas.dataset.ambientShaderState = "fallback";
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mobileLocation = gl.getUniformLocation(program, "u_mobile");
    const positionBuffer = gl.createBuffer();

    if (
      positionLocation < 0 ||
      !resolutionLocation ||
      !timeLocation ||
      !mobileLocation ||
      !positionBuffer
    ) {
      gl.deleteProgram(program);
      canvas.dataset.ambientShaderState = "fallback";
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    canvas.dataset.ambientShaderState = reduceMotion ? "static" : "animating";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(bounds.width * dpr));
      const height = Math.max(1, Math.floor(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    let frameId: number | null = null;
    const start = performance.now();

    const render = (now: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, reduceMotion ? 18 : (now - start) / 1000);
      gl.uniform1f(mobileLocation, mobileMedia.matches ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reduceMotion) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    resize();
    render(start);
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.visualViewport?.addEventListener("resize", resize, {
      passive: true,
    });

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-ambient-shader
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-90 mix-blend-multiply [filter:saturate(1.12)] motion-reduce:opacity-65"
    >
      <canvas
        ref={canvasRef}
        data-ambient-shader-canvas
        className="block h-full w-full"
      />
    </div>
  );
}
