import type { NextAuthConfig } from "next-auth";

const PROTECTED_ROUTES = ["/api/chat", "/chat", "/settings"];

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    // newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = PROTECTED_ROUTES.some((route) => nextUrl.pathname.startsWith(route));
      const isOnRegister = nextUrl.pathname.startsWith("/sign-up");
      const isOnLogin = nextUrl.pathname.startsWith("/sign-in");

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      if (isOnRegister || isOnLogin) {
        return true; // Always allow access to register and login pages
      }

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
