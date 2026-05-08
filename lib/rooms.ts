/**
 * Single source of truth for "rooms" — the spatial metaphor that gives the
 * site its museum feel. Drives RunningHead, RoomNumeral, favicons, nav order.
 */

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export type Room = {
  /** route path */
  href: string;
  /** roman numeral, set in Instrument Serif italic top-right */
  numeral: string;
  /** wing letter shown in the bracketed running-head [JH / II / 03] */
  wing: string;
  /** "atrium", "library", etc. — the spatial label set in mono caption */
  name: string;
  /** the route's lowercase nav label */
  label: string;
  /** show in primary nav? */
  inNav: boolean;
  /** show on mobile nav? (limit 3) */
  inMobileNav: boolean;
};

export const ROOMS: Room[] = [
  { href: "/", numeral: "I", wing: "I", name: "entry hall", label: "home", inNav: false, inMobileNav: false },
  { href: "/work", numeral: "II", wing: "II", name: "atrium", label: "work", inNav: true, inMobileNav: true },
  { href: "/lab", numeral: "III", wing: "III", name: "study room", label: "lab", inNav: true, inMobileNav: false },
  { href: "/agents", numeral: "IV", wing: "IV", name: "roster wall", label: "agents", inNav: true, inMobileNav: false },
  { href: "/about", numeral: "V", wing: "V", name: "anteroom", label: "about", inNav: true, inMobileNav: true },
  { href: "/contact", numeral: "VI", wing: "VI", name: "vestibule", label: "contact", inNav: false, inMobileNav: true },
];

export function findRoom(pathname: string | null | undefined): Room {
  if (!pathname) return ROOMS[0]!;
  // Exact match first, then prefix match (e.g. /work/foo -> /work)
  const exact = ROOMS.find((r) => r.href === pathname);
  if (exact) return exact;
  // For nested routes like /work/[slug], use the parent room
  const parent = ROOMS.find((r) => r.href !== "/" && pathname.startsWith(`${r.href}/`));
  return parent ?? ROOMS[0]!;
}

/** Format the editorial running-head: `[JH / II / 03]` */
export function runningHead(room: Room, piece?: string | number): string {
  const pieceStr = piece != null ? String(piece).padStart(2, "0") : "—";
  return `[ JH / ${room.wing} / ${pieceStr} ]`;
}

/** Convert an integer 1-10 to a Roman numeral (for case-study scene labels). */
export function toRoman(n: number): string {
  if (n < 1) return "0";
  if (n > 10) return String(n);
  return ROMAN[n - 1] ?? String(n);
}
