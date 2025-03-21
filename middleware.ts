import NextAuth from "next-auth";

import { authConfig } from "@/app/(app)/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/chat/:path*", "/api/:path*", "/sign-in", "/sign-up", "/settings"],
};
