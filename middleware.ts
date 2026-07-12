import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect routes using NextAuth middleware
export default withAuth(
  // Runs before the request reaches the route.
  // If authorization succeeds, continue to the requested page.
  function middleware() {
    return NextResponse.next();
  },

  {
    callbacks: {
      // Determines whether the current request
      // is allowed to access the requested route.
      authorized({ req, token }) {
        // Get the current request path
        const { pathname } = req.nextUrl;

        // Allow authentication-related routes
        // without requiring the user to log in.
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        )
          return true;

        // Public routes that anyone can access
        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }

        // For all other routes,
        // allow access only if the user has a valid session token.
        return !!token;
      },
    },
  },
);

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Run middleware for all routes except:
     * - _next/static (static files)
     * - _next/image (optimized images)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

/** User requests page
        │
        ▼
Middleware runs
        │
        ▼
withAuth()
        │
        ▼
Extract JWT Token
        │
        ▼
authorized()
        │
        ▼
Public Route?
     │
Yes ─────────► Allow
     │
No
     ▼
Token Exists?
     │
 ┌───┴────┐
 │        │
Yes       No
 │        │
 ▼        ▼
Allow   Block/Redirect*/
