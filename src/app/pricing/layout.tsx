import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for event organizers. Create free events or sell paid tickets with competitive platform fees.",
  openGraph: {
    title: "Pricing | MyInvite",
    description: "Simple, transparent pricing for event organizers on MyInvite.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
