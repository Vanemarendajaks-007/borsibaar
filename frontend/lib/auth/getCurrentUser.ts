import "server-only";
import { cookies } from "next/headers";

// Shape returned by backend /api/account
export interface CurrentUser {
  id: number | string;
  email: string;
  name?: string;
  organizationId?: number;
  needsOnboarding: boolean;
  role?: string;
}

interface Result {
  user: CurrentUser | null;
  status: number; // HTTP status from backend (or synthesized)
}

// Centralized server-side user fetch. Always no-store to avoid caching auth.
export async function getCurrentUser(): Promise<Result> {
  const cookieStore = await cookies();
  // Forward all cookies to the backend, just like middleware does
  const headers: Record<string, string> = {};
  const cookieHeader = cookieStore.toString();
  if (cookieHeader) headers.cookie = cookieHeader;

  // Server-side: use BACKEND_URL directly (Docker internal network)
  // This is more efficient than going through Next.js API route
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  let res: Response | null = null;
  try {
    res = await fetch(`${backendUrl}/api/account`, {
      headers,
      cache: "no-store",
    });
  } catch {
    return { user: null, status: 503 };
  }

  if (res.status === 401) return { user: null, status: 401 };
  if (!res.ok) return { user: null, status: res.status };

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return { user: null, status: 502 };
  try {
    const json = (await res.json()) as CurrentUser;
    if (!json || typeof json !== "object") return { user: null, status: 500 };
    return { user: json, status: 200 };
  } catch {
    return { user: null, status: 500 };
  }
}
