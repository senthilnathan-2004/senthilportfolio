import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectDB();
          const user = await User.findOne({
            email: (credentials.email as string).toLowerCase(),
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            role: "admin",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.AUTH_SECRET,
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      name?: string | null;
      image?: string | null;
    };
  }
}
