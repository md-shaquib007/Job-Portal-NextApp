export async function register() {
  if (process.env.SKIP_ENV_VALIDATION === "true") return;

  const { validateEnv } = await import("@/config/env");

  try {
    validateEnv();
  } catch (error) {
    // Allow CI/build without secrets when explicitly skipped or DB URL missing during build
    if (
      process.env.npm_lifecycle_event === "build" &&
      !process.env.DATABASE_URL?.trim()
    ) {
      console.warn("[env] Skipping validation during build without DATABASE_URL");
      return;
    }
    throw error;
  }
}
