"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { startTransition as startView } from "@/lib/view-transitions";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
};

/**
 * Drop-in replacement for next/link that wraps the navigation in a View
 * Transition (cinnamon curtain wipe defined in app/globals.css). Falls back
 * to plain client navigation when the API is unavailable or reduced-motion.
 *
 * Use for any cross-route nav where the room transition should fire. Skip on
 * external links and same-page anchors.
 */
export const ViewLink = forwardRef<HTMLAnchorElement, Props>(function ViewLink(
  { href, prefetch, scroll, replace, onClick, children, ...rest },
  ref,
) {
  const router = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // honor modifier keys + new-tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) return;
    e.preventDefault();
    startView(() => {
      if (replace) router.replace(href, { scroll });
      else router.push(href, { scroll });
    });
  };
  return (
    <Link ref={ref} href={href} prefetch={prefetch} onClick={handle} {...rest}>
      {children}
    </Link>
  );
});
