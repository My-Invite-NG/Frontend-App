import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to common questions about MyInvite. Get help with tickets, events, payments, and account management.",
  openGraph: {
    title: "Help Center | MyInvite",
    description: "Find answers to common questions about MyInvite.",
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
