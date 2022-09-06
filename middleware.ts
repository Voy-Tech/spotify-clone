import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// https://stackoverflow.com/questions/73476987/uncaught-syntaxerror-unexpected-token-when-using-next-middleware
export async function middleware(req: NextRequest) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // Allow the request if the following is true:
  // A. Its a requst for next-auth session & provider fetching
  // B. The token exist

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect them to login if they dont have token and are requesting a protected route
  if (!token && pathname !== "/login") {
    return NextResponse.rewrite(new URL("/login", req.url));
  }
}

export const config = {
  matcher: "/",
};
