import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_STATIC_PREFIXES = ["/_next/", "/favicon", "/images", "/api", "/public"];

const LOCALES = ["mn", "en", "ko"];
const DEFAULT_LOCALE = "mn";

// Auth pages that are always accessible without a token
const PUBLIC_AUTH_PATHS = [
  "/log-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets and API routes
  if (PUBLIC_STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 2. Locale redirect: if no locale prefix, add the default one
  const hasLocale = LOCALES.some((locale) => pathname.startsWith(`/${locale}`));
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  // 3. Allow public auth pages (e.g. /mn/log-in)
  const pathWithoutLocale = pathname.replace(/^\/(mn|en|ko)/, "") || "/";
  if (PUBLIC_AUTH_PATHS.some((p) => pathWithoutLocale.startsWith(p))) {
    return NextResponse.next();
  }

  // 4. Auth protection: check for token cookie
  // The token cookie is written by AuthProvider.setAuthToken() alongside localStorage.
  // Existing sessions (logged in before this fix) won't have the cookie until next login.
  const token = request.cookies.get("token")?.value;
  if (!token) {
    const locale = pathname.match(/^\/(mn|en|ko)/)?.[1] ?? DEFAULT_LOCALE;
    const loginUrl = new URL(`/${locale}/log-in`, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api routes
     * - static files (images, fonts, etc.)
     * - Next.js internals (_next)
     */
    "/((?!api|_next|.*\\..*).*)",
  ],
};
