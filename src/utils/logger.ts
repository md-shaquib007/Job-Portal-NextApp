import { isProduction } from "@/config/env";

type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: unknown) {
  if (level === "info" && isProduction()) return;

  const prefix = `[${level.toUpperCase()}]`;
  if (meta !== undefined) {
    console[level](prefix, message, meta);
  } else {
    console[level](prefix, message);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
};
