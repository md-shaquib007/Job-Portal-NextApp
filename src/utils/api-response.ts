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
  const message = isProduction()
    ? "An unexpected error occurred. Please try again."
    : error instanceof Error
      ? error.message
      : "Unknown error";
  return apiError(message, 500);
}
