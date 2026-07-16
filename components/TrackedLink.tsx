"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  data?: Record<string, string>;
  children: ReactNode;
};

/** Anchor that reports a Vercel Analytics event on click. */
export function TrackedLink({ event, data, children, ...rest }: TrackedLinkProps) {
  return (
    <a {...rest} onClick={() => track(event, data)}>
      {children}
    </a>
  );
}
