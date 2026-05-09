"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PIPELINES, type Pipeline, type PipelineNode } from "@/lib/pipelines";

const VIEW_W = 1200;
const VIEW_H = 400;
const NODE_W = 168;
const NODE_H = 96;

const CINEMA = [0.65, 0, 0.35, 1] as const;

export function PipelineVisualizer() {
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const pipeline = PIPELINES[activeIdx]!;

  // Reset focused node when switching pipelines
  const switchPipeline = (i: number) => {
    setActiveIdx(i);
    setActiveNodeId(null);
  };

  const activeNode = useMemo(
    () => pipeline.nodes.find((n) => n.id === activeNodeId) ?? null,
    [pipeline, activeNodeId],
  );

  const nodeMap = useMemo(
    () => Object.fromEntries(pipeline.nodes.map((n) => [n.id, n] as const)),
    [pipeline],
  );

  return (
    <section className="flex flex-col gap-10">
      {/* tab strip — pipeline selector */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-[var(--ink-4)] py-4">
        {PIPELINES.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => switchPipeline(i)}
            data-cursor="link"
            className={
              "group relative flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 " +
              (i === activeIdx
                ? "text-[var(--ink-0)]"
                : "text-[var(--ink-3)] hover:text-[var(--ink-1)]")
            }
          >
            <span className="font-display text-[14px] font-light tabular-nums leading-none tracking-[-0.04em] text-[var(--ink-1)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{p.label}</span>
            {i === activeIdx ? (
              <span
                aria-hidden
                className="absolute -bottom-[17px] left-0 right-0 h-px bg-[var(--cinnamon)]"
              />
            ) : null}
          </button>
        ))}
      </div>

      {/* totals row — quick summary above the canvas */}
      <Totals pipeline={pipeline} />

      {/* canvas — node graph */}
      <figure
        className="relative overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)]"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        {/* faint blueprint grid */}
        <BlueprintGrid />

        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full"
          aria-label={`${pipeline.label} pipeline diagram`}
        >
          {/* edges first (so nodes paint on top) */}
          <g>
            {pipeline.edges.map((e, i) => {
              const a = nodeMap[e.from];
              const b = nodeMap[e.to];
              if (!a || !b) return null;
              return (
                <Edge
                  key={`${e.from}-${e.to}-${i}`}
                  from={a}
                  to={b}
                  loop={!!e.loop}
                  index={i}
                  reduce={!!reduce}
                />
              );
            })}
          </g>

          {/* nodes */}
          <g>
            {pipeline.nodes.map((n, i) => (
              <Node
                key={n.id}
                node={n}
                index={i + 1}
                active={activeNodeId === n.id}
                onActivate={() => setActiveNodeId(n.id)}
                reduce={!!reduce}
              />
            ))}
          </g>
        </svg>
      </figure>

      {/* drawer — receipt for the focused node */}
      <Drawer pipeline={pipeline} node={activeNode} />
    </section>
  );
}

function Totals({ pipeline }: { pipeline: Pipeline }) {
  const items = [
    { k: "brief", v: pipeline.brief },
    { k: "cost", v: pipeline.totalCost },
    { k: "time", v: pipeline.totalTime },
    { k: "out", v: pipeline.finalOutput },
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
      {items.map((it) => (
        <div key={it.k} className="flex flex-col gap-1">
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
            {it.k}
          </dt>
          <dd className="font-display text-[clamp(14px,1vw,18px)] font-light lowercase leading-snug tracking-[-0.015em] text-[var(--ink-0)]">
            {it.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function BlueprintGrid() {
  // 24-col light grid — faint, decorative; sits behind the SVG.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--ink-4) 1px, transparent 1px),
          linear-gradient(to bottom, var(--ink-4) 1px, transparent 1px)
        `,
        backgroundSize: `${VIEW_W / 24}px ${VIEW_H / 8}px`,
      }}
    />
  );
}

function Node({
  node,
  index,
  active,
  onActivate,
  reduce,
}: {
  node: PipelineNode;
  index: number;
  active: boolean;
  onActivate: () => void;
  reduce: boolean;
}) {
  const left = node.x - NODE_W / 2;
  const top = node.y - NODE_H / 2;
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.06, ease: CINEMA }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      style={{ cursor: "pointer", outline: "none" }}
      data-cursor="link"
    >
      <rect
        x={left}
        y={top}
        width={NODE_W}
        height={NODE_H}
        fill={active ? "var(--cream-0)" : "var(--cream-0)"}
        stroke={active ? "var(--ink-0)" : "var(--ink-3)"}
        strokeWidth={active ? 1.2 : 0.7}
      />

      {/* corner pip — cinnamon when active */}
      <circle
        cx={left + NODE_W - 10}
        cy={top + 10}
        r={2.6}
        fill={active ? "var(--cinnamon)" : "var(--ink-4)"}
      />

      {/* index — Outfit Black */}
      <text
        x={left + 14}
        y={top + 28}
        fontFamily="Outfit, sans-serif"
        fontSize="18"
        fontWeight="300"
        fill="var(--ink-1)"
        style={{ letterSpacing: "-0.04em" }}
      >
        {String(index).padStart(2, "0")}
      </text>

      {/* hairline */}
      <line
        x1={left + 14}
        y1={top + 38}
        x2={left + 36}
        y2={top + 38}
        stroke="var(--ink-3)"
        strokeWidth="0.8"
      />

      {/* label */}
      <text
        x={left + 14}
        y={top + 58}
        fontFamily="Outfit, sans-serif"
        fontSize="15"
        fontWeight="400"
        fill="var(--ink-0)"
        style={{ letterSpacing: "-0.02em" }}
      >
        {node.label}
      </text>

      {/* tool */}
      <text
        x={left + 14}
        y={top + 76}
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill="var(--ink-2)"
        style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {node.tool}
      </text>

      {/* cost · time line */}
      <text
        x={left + 14}
        y={top + 89}
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill="var(--ink-3)"
        style={{ letterSpacing: "0.06em" }}
      >
        {[node.cost, node.time].filter(Boolean).join("  ·  ")}
      </text>
    </motion.g>
  );
}

function Edge({
  from,
  to,
  loop,
  index,
  reduce,
}: {
  from: PipelineNode;
  to: PipelineNode;
  loop: boolean;
  index: number;
  reduce: boolean;
}) {
  // For straight edges, exit/enter at the right/left edge of each node box.
  const x1 = loop ? from.x : from.x + NODE_W / 2;
  const y1 = loop ? from.y - NODE_H / 2 : from.y;
  const x2 = loop ? to.x : to.x - NODE_W / 2;
  const y2 = loop ? to.y - NODE_H / 2 : to.y;

  // Loop arc — sweep up and over from publish back to schedule.
  const path = loop
    ? `M ${x1} ${y1} C ${x1} ${y1 - 100}, ${x2} ${y2 - 100}, ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;

  return (
    <motion.g
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration: 0.7, delay: 0.4 + index * 0.05, ease: CINEMA },
        opacity: { duration: 0.3, delay: 0.4 + index * 0.05 },
      }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke={loop ? "var(--ink-3)" : "var(--cinnamon)"}
        strokeWidth={loop ? 0.8 : 1.1}
        strokeDasharray={loop ? "3 4" : undefined}
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.4 + index * 0.05,
          ease: CINEMA,
        }}
      />
      {/* arrow head */}
      {!loop ? <ArrowHead x={x2} y={y2} /> : <ArrowHead x={x2} y={y2} angle={90} />}
    </motion.g>
  );
}

function ArrowHead({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <polygon points="-6,-3 0,0 -6,3" fill="var(--cinnamon)" />
    </g>
  );
}

function Drawer({
  pipeline,
  node,
}: {
  pipeline: Pipeline;
  node: PipelineNode | null;
}) {
  const fallback = pipeline.nodes[0]!;
  const n = node ?? fallback;
  return (
    <motion.div
      key={`${pipeline.slug}-${n.id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: CINEMA }}
      className="grid grid-cols-1 gap-8 border-t border-[var(--ink-4)] pt-8 md:grid-cols-12"
    >
      <div className="md:col-span-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
          {node ? "step" : "step · select a node"}
        </p>
        <p className="mt-3 font-display text-[clamp(22px,2vw,32px)] font-light lowercase leading-none tracking-[-0.04em] text-[var(--ink-0)]">
          {n.label}
          <span aria-hidden className="text-[var(--cinnamon)]">.</span>
        </p>
      </div>

      <div className="md:col-span-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
          summary
        </p>
        <p className="mt-3 max-w-[44ch] font-display font-light text-[clamp(16px,1.2vw,20px)] leading-relaxed tracking-[-0.01em] text-[var(--ink-1)]">
          {n.summary}
        </p>
      </div>

      <div className="md:col-span-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
          receipts
        </p>
        <ul className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-1)]">
          <Receipt label="tool" value={n.tool} />
          {n.cost ? <Receipt label="cost" value={n.cost} /> : null}
          {n.time ? <Receipt label="time" value={n.time} /> : null}
          <Receipt label="out" value={n.output} />
        </ul>

        <a
          href="mailto:hello@hammathyme.ai?subject=lab%20%C2%B7%20pipeline%20configs"
          data-cursor="link"
          data-cursor-label="ask →"
          className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
        >
          <span aria-hidden className="block h-px w-6 bg-[var(--ink-3)]" />
          request the full prompt + config
        </a>
      </div>
    </motion.div>
  );
}

function Receipt({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline gap-3">
      <span className="text-[var(--ink-3)]">{label}</span>
      <span aria-hidden className="block h-px flex-1 bg-[var(--ink-4)]" />
      <span>{value}</span>
    </li>
  );
}
