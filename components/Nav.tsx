"use client";

import { ViewLink } from "./ViewLink";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
];

export function Nav() {
  const path = usePathname();
  const active = (href: string) => path === href || path?.startsWith(`${href}/`);

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-12 md:py-6">
      <ViewLink
        href="/"
        className="pointer-events-auto"
        data-cursor="link"
        aria-label="hammer · home"
      >
        <Wordmark size="sm" />
      </ViewLink>

      <ul className="pointer-events-auto hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.22em] md:flex">
        {LINKS.map((l) => (
          <li key={l.href}>
            <ViewLink
              href={l.href}
              data-cursor="link"
              className={
                "group relative inline-flex min-h-6 items-center pb-1 transition-colors duration-200 " +
                (active(l.href) ? "text-[var(--cinnamon)]" : "text-[var(--ink-1)] hover:text-[var(--ink-0)]")
              }
            >
              {l.label}
              <span
                className={
                  "absolute -bottom-0.5 left-0 h-px bg-[var(--cinnamon)] transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] " +
                  (active(l.href) ? "w-full" : "w-0 group-hover:w-full")
                }
              />
            </ViewLink>
          </li>
        ))}
      </ul>

      <ViewLink
        href="/contact"
        data-cursor="link"
        data-cursor-label="say hi"
        className="pointer-events-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-0)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cinnamon)]" aria-hidden />
        get in touch
      </ViewLink>
    </nav>
  );
}
