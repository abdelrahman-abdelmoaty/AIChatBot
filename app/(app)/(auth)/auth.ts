import { compare } from "bcrypt-ts";
import NextAuth, { type User, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { getUserByEmail } from "@/server/user";

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const { user, error } = await getUserByEmail(email);
        if (!user || error) return null;
        const passwordsMatch = await compare(password, user.password);
        if (!passwordsMatch) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
