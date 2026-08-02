import { NextResponse } from "next/server";
import { AuthController } from "@/controllers/auth.controller";

/** OAuth/env setup check — use /api/auth/status (NextAuth owns /api/auth/providers). */
export async function GET() {
  return NextResponse.json(AuthController.getProviderStatus());
}
