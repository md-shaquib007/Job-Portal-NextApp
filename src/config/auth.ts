import { AuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "@/config/database";
import { verifyPassword } from "@/utils/crypto";
import { ensureAuthEnv, isGitHubAuthEnabled, isProduction } from "@/config/env";

ensureAuthEnv();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  ...(isProduction()
    ? {}
    : {
        allowDangerousEmailAccountLinking: true,
      }),
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: isProduction(),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password) return null;
        if (!verifyPassword(credentials.password, user.password)) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    ...(isGitHubAuthEnabled()
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "github" && !isGitHubAuthEnabled()) return false;
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        return token;
      }
      if (token.email && !token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (dbUser) token.id = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id;
      return session;
    },
  },
};
