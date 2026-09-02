export async function register() {
  if (process.env.SKIP_ENV_VALIDATION === "true") return;

  try {
    const { validateEnv } = await import("@/config/env");
    validateEnv();
  } catch (error) {
    console.warn("[env] Initialization warning:", error);
  }
}
