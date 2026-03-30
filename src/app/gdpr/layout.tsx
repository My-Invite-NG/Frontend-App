import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Compliance",
  description: "MyInvite's GDPR compliance policy, covering data subject rights, data processing, and privacy protections.",
};

export default function GdprLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
