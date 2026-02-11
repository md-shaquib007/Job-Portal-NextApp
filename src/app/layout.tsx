// app/layout.tsx
import Navbar from "@/components/Navbar";
import SessionWrapper from "./auth/signin/SessionWrapper";
import "./globals.css";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SessionWrapper session={session}>
          <Navbar />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
