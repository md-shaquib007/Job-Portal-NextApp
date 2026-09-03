import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role;

    // Employers & Admins can access post and edit routes
    if (
      (pathname.startsWith("/jobs/post") || pathname.includes("/edit")) &&
      role !== "EMPLOYER" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard?notice=employer_required", req.url),
      );
    }
  },
  {
    pages: { signIn: "/auth/signin" },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/jobs/post", "/jobs/:id/edit"],
};
