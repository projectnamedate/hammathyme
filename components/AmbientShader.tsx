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

mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.052;
  vec2 q = rotate(0.28 + sin(t * 0.7) * 0.055) * p;

  float waveA = 0.5 + 0.5 * sin((q.x * 2.8 + q.y * 1.8) + t * 2.3);
  float waveB = 0.5 + 0.5 * sin((q.x * -1.5 + q.y * 3.2) - t * 1.9);
  float waveC = 0.5 + 0.5 * sin(length(q + vec2(sin(t * 0.7) * 0.35, cos(t * 0.8) * 0.22)) * 8.0 - t * 1.5);
  float wash = smoothstep(0.12, 0.94, waveA * 0.50 + waveB * 0.36 + waveC * 0.30);
  float filament = pow(0.5 + 0.5 * sin((q.x - q.y) * 4.2 + t * 2.2), 2.45);
  float vignette = 1.0 - smoothstep(0.55, 1.35, length(p));

  vec3 cream = vec3(0.980, 0.933, 0.914);
  vec3 rose = vec3(0.949, 0.867, 0.831);
  vec3 cinnamon = vec3(0.949, 0.557, 0.525);

  vec3 color = mix(cream, rose, wash * 0.78);
  color = mix(color, cinnamon, filament * 0.22);

  float alpha = (0.14 + wash * 0.16 + filament * 0.085) * (0.70 + vignette * 0.30);
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

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const positionBuffer = gl.createBuffer();

    if (
      positionLocation < 0 ||
      !resolutionLocation ||
      !timeLocation ||
      !positionBuffer
    ) {
      gl.deleteProgram(program);
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
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
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
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reduceMotion) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    resize();
    render(start);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-ambient-shader
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-90 mix-blend-multiply [filter:saturate(1.08)] motion-reduce:opacity-60"
      style={{
        background:
          "linear-gradient(115deg, rgba(242, 142, 134, 0.16), rgba(250, 238, 233, 0) 36%, rgba(229, 191, 180, 0.22) 66%, rgba(242, 142, 134, 0.10))",
      }}
    >
      <canvas
        ref={canvasRef}
        data-ambient-shader-canvas
        className="block h-full w-full"
      />
    </div>
  );
}
