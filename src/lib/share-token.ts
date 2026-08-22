import { randomBytes } from "crypto";

export function generateShareToken(length: number = 24): string {
  return randomBytes(length).toString("hex").slice(0, length);
}

export function isValidShareToken(token: string): boolean {
  return /^[a-f0-9]{16,64}$/i.test(token);
}
