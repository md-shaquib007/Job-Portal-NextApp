import { NextResponse } from "next/server";
import { isProduction } from "@/config/env";
import { logger } from "@/utils/logger";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(
  message: string,
  status: number,
  extras?: Record<string, unknown>,
) {
  return NextResponse.json({ error: message, ...extras }, { status });
}

export function handleApiError(context: string, error: unknown) {
  logger.error(context, error);
  if (isDatabaseUnavailable(error)) {
    return apiError("Database is temporarily unavailable. Please try again later.", 503);
  }
  const message = isProduction()
    ? "An unexpected error occurred. Please try again."
    : error instanceof Error
      ? error.message
      : "Unknown error";
  return apiError(message, 500);
}

function isDatabaseUnavailable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const code = "code" in error && typeof error.code === "string" ? error.code : "";
  if (["P1001", "P1002", "P1017"].includes(code)) return true;

  const message = "message" in error && typeof error.message === "string"
    ? error.message.toLowerCase()
    : "";
  return [
    "econnrefused",
    "enotfound",
    "getaddrinfo",
    "connection terminated",
    "can't reach database",
    "database server",
    "timed out",
  ].some(
    (term) => message.includes(term),
  );
}
