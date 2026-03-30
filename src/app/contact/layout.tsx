import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have questions about MyInvite? Reach out to our support team. We're here to help with ticketing, payments, and event hosting.",
  openGraph: {
    title: "Contact Us | MyInvite",
    description: "Have questions about MyInvite? Reach out to our support team.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
