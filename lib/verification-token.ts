import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

type VerificationPayload = { candidateId: string; exp: number };

function secret() {
  const value = process.env.BOOKING_TOKEN_SECRET;
  if (!value || value.length < 32) throw new Error("BOOKING_TOKEN_SECRET deve ter ao menos 32 caracteres.");
  return value;
}

export function createVerificationToken(candidateId: string) {
  const payload: VerificationPayload = { candidateId, exp: Date.now() + 15 * 60 * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function readVerificationToken(token: string): VerificationPayload | null {
  const [encoded, received] = token.split(".");
  if (!encoded || !received) return null;
  const expected = createHmac("sha256", secret()).update(encoded).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  if (expectedBuffer.length !== receivedBuffer.length || !timingSafeEqual(expectedBuffer, receivedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as VerificationPayload;
    return payload.exp > Date.now() && typeof payload.candidateId === "string" ? payload : null;
  } catch {
    return null;
  }
}
