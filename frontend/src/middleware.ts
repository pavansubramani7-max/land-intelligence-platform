import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", "/valuation/:path*", "/dispute/:path*",
    "/fraud/:path*", "/forecast/:path*", "/legal/:path*",
    "/geo/:path*", "/recommendation/:path*", "/reports/:path*",
    "/admin/:path*", "/market/:path*", "/chatbot/:path*",
    "/land/:path*", "/ownership/:path*", "/profile/:path*",
  ],
};
