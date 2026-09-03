import NextAuth from "next-auth";
import { authOptions } from "@/config/auth";

const handler = (req: Request, ctx: any) => {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  if (host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return NextAuth(req as any, ctx, authOptions);
};

export { handler as GET, handler as POST };
