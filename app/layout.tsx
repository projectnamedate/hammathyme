import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Cursor } from "@/components/Cursor";
import { FilmGrain } from "@/components/FilmGrain";
import { Nav } from "@/components/Nav";
import { RunningHead } from "@/components/RunningHead";
import { RoomNumeral } from "@/components/RoomNumeral";
import { IdleBreath } from "@/components/IdleBreath";
import { EntryCurtain } from "@/components/EntryCurtain";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hammathyme.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "hammer · ai producer",
    template: "%s · hammer",
  },
  description:
    "Jeff Hammer. Fifteen years in broadcast, now producing with AI. Autonomous characters, motion graphics, AI film, pipelines, brand systems.",
  applicationName: "hammer",
  authors: [{ name: "Jeff Hammer" }],
  creator: "Jeff Hammer",
  openGraph: {
    type: "website",
    siteName: "hammer · ai producer",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/icon.svg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body>
        <FilmGrain />
        <Nav />
        <RunningHead />
        <RoomNumeral />
        {children}
        <Cursor />
        <IdleBreath />
        <EntryCurtain />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
