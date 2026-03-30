import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Events",
  description: "Discover concerts, parties, conferences, and more events happening near you. Search, filter, and buy tickets on MyInvite.",
  openGraph: {
    title: "Browse Events | MyInvite",
    description: "Discover concerts, parties, conferences, and more events happening near you.",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
