import NextAuth from "next-auth";
import { authOptions } from "@/config/auth";
import { NextRequest } from "next/server";

const handler = (req: NextRequest, ctx: unknown) => {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  if (host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextAuth(req as any, ctx as any, authOptions);
};

export { handler as GET, handler as POST };
