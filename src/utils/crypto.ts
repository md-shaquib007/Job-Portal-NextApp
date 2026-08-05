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
  if (!salt || !key || !/^[a-f0-9]{128}$/i.test(key)) return false;

  try {
    const storedKey = Buffer.from(key, "hex");
    const hashedKey = scryptSync(password, salt, 64);
    return storedKey.length === hashedKey.length && timingSafeEqual(storedKey, hashedKey);
  } catch {
    return false;
  }
}
