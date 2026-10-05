import "server-only";
import { isIP } from "node:net";
import { getSecurityState } from "./security-store";

export async function isRateLimited(key: string, limit: number, windowMs: number): Promise<boolean> {
  try {
    return await getSecurityState().isRateLimited(key, limit, windowMs);
  } catch {
    // An unavailable shared store must never silently disable abuse controls.
    console.error("Shared security rate-limit storage unavailable");
    return true;
  }
}

export function requestAddress(request: Pick<Request, "headers">): string {
  // Vercel overwrites this header at its trusted edge. Self-hosted deployments
  // must configure their reverse proxy to overwrite it too.
  const forwarded = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")
    : request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",")[0]?.trim();
  return candidate && isIP(candidate) ? candidate : "unknown";
}
