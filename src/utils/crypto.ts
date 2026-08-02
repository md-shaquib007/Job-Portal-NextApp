import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashedPassword}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const [salt, key] = parts;
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");

  return timingSafeEqual(
    Buffer.from(key, "hex"),
    Buffer.from(hashedPassword, "hex"),
  );
}
