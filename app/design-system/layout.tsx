import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "design system · hammer",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
