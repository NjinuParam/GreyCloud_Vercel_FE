import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSessionData } from "./lib/auth/auth";

export async function middleware(request: NextRequest) {
  // const session = await getIronSessionData();

  // if (!session.isLoggedIn) {
  //   return NextResponse.redirect("/login");
  // }

  // List of paths accessible by unauthenticated users
  // const publicPaths = [
  //   "/",
  //   "/login",
  //   "/register",
  //   "/dashboard",
  //   "/manage-password",
  //   "/manage-password/change-password",
  //   "/manage-password/forgot-password",
  //   "/manage-password/reset-password",
  // ];

  // Redirect authenticated users trying to access login, register, or forgot-password back to the root path
  // if (session.isLoggedIn && publicPaths.slice(1).includes(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // // Allow unauthenticated users to access the public paths
  // if (!session.isLoggedIn && !publicPaths.includes(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
