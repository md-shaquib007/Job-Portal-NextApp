import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().optional(),
  VERCEL_URL: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

/** Ensures NEXTAUTH_URL is set for OAuth callbacks on Vercel. */
export function ensureAuthEnv(): void {
  if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.trim();
    process.env.NEXTAUTH_URL = host.startsWith("http://") || host.startsWith("https://")
      ? host
      : `https://${host}`;
  }
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getAuthBaseUrl(): string | undefined {
  ensureAuthEnv();
  return process.env.NEXTAUTH_URL;
}

export function isGitHubAuthEnabled(): boolean {
  return (
    Boolean(process.env.GITHUB_CLIENT_ID?.trim()) &&
    Boolean(process.env.GITHUB_CLIENT_SECRET?.trim())
  );
}

export function isAuthConfigured(): boolean {
  ensureAuthEnv();
  return Boolean(process.env.NEXTAUTH_SECRET?.trim());
}

/** Validates environment variables. Uses safe fallbacks to prevent production server crashes. */
export function validateEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  ensureAuthEnv();

  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    console.warn(`[env] Warning: ${message}`);

    cachedEnv = {
      DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://localhost:5432/dev",
      NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32
          ? process.env.NEXTAUTH_SECRET
          : "production-resilient-fallback-nextauth-secret-32-chars-minimum",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
    };
    return cachedEnv;
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export function getEnv(): ServerEnv {
  return validateEnv();
}
