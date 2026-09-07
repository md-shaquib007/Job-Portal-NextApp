import { NextResponse } from "next/server";
import { prisma } from "@/config/database";

export async function GET() {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;
    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      database: {
        status: "connected",
        latencyMs,
      },
      system: {
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          error: error instanceof Error ? error.message : "Database ping failed",
        },
      },
      { status: 503 },
    );
  }
}
