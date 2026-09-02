import type { Metadata } from "next";
import NavbarView from "@/views/layout/NavbarView";
import SessionProvider from "@/providers/SessionProvider";
import { getSession } from "@/config/session";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Job Board",
    template: "%s | Job Board",
  },
  description:
    "Browse job listings, apply in one click, and manage applications on a modern job board.",
  metadataBase: process.env.NEXTAUTH_URL
    ? new URL(process.env.NEXTAUTH_URL)
    : undefined,
  openGraph: {
    title: "Job Board",
    description: "Find your next role or post openings for your team.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.warn("[RootLayout] Could not retrieve session:", error);
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <NavbarView />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
