import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/ToastProvider";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://myinvite.ng"),
  title: {
    default: "MyInvite - Find Your Next Experience",
    template: "%s | MyInvite",
  },
  description: "Discover thousands of events happening near you and around the world. Create, promote, and sell tickets to your events with MyInvite.",
  keywords: ["events", "tickets", "concert", "party", "conference", "meetup", "Nigeria", "Lagos", "event management"],
  authors: [{ name: "MyInvite" }],
  creator: "MyInvite",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "MyInvite",
    title: "MyInvite - Find Your Next Experience",
    description: "Discover thousands of events happening near you and around the world.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyInvite - Find Your Next Experience",
    description: "Discover thousands of events happening near you and around the world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ToastProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
