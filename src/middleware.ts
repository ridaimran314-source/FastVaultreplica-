import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SITE_ACCESS_COOKIE,
  SITE_ACCESS_VALUE,
} from "@/lib/site-access";

export function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!sitePassword) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname === "/site-login" ||
    pathname.startsWith("/api/site-access") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico");

  if (isPublicPath) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get(SITE_ACCESS_COOKIE);
  if (accessCookie?.value === SITE_ACCESS_VALUE) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/site-login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
