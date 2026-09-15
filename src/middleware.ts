import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

const protectedRoutes = ["/my-bookings", "/profile", "/notifications"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. ถ้าไม่มี Token
  if (!token) {
    if (isProtectedRoute || isAdminRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. ถ้ามี Token ให้ตรวจสอบ
  const payload = await verifyJWT(token);

  // ถ้า Token ไม่ถูกต้องหรือหมดอายุ
  if (!payload) {
    if (isProtectedRoute || isAdminRoute) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
    return NextResponse.next();
  }

  // ถ้ามี Token ถูกต้องและยังล็อกอินอยู่
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-bookings/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
