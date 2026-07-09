import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting map (in-memory, resets on redeploy — sufficient for edge)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  // Rate limit the login POST
  if (pathname === "/admin/login" && req.method === "POST") {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (record) {
      if (now < record.resetAt) {
        if (record.count >= MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: "Too many login attempts. Try again in 15 minutes." },
            { status: 429 }
          );
        }
        record.count++;
      } else {
        loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      }
    } else {
      loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    }
  }

  // Protect /admin/* (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = (req as unknown as { auth: { user?: { role?: string } } | null }).auth;
    if (!session?.user?.role) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
