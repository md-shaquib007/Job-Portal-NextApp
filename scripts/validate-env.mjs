/**
 * Validates required production environment variables.
 * Usage: set vars in shell or .env.local, then run: npm run validate:env
 */

const errors = [];

function requireVar(name) {
  const value = process.env[name]?.trim();
  if (!value) errors.push(`${name} is required`);
  return value;
}

requireVar("DATABASE_URL");
const secret = requireVar("NEXTAUTH_SECRET");

if (secret && secret.length < 32) {
  errors.push("NEXTAUTH_SECRET must be at least 32 characters");
}

if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL?.trim()) {
  if (!process.env.VERCEL_URL?.trim()) {
    errors.push("NEXTAUTH_URL is required in production (or deploy on Vercel)");
  }
}

if (errors.length > 0) {
  console.error("Environment validation failed:");
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log("Environment validation passed.");
