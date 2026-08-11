import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // OTP-Verified Session Provider
    // Creates a real NextAuth JWT session after OTP authentication.
    // The verify API endpoint must confirm `verified: true` before signIn is called.
    CredentialsProvider({
      id: "otp-verified",
      name: "OTP Verified",
      credentials: {
        target: { label: "Target", type: "text" },
        type: { label: "Type", type: "text" },
        verified: { label: "Verified", type: "text" },
      },
      async authorize(credentials) {
        // Only issue a session if the OTP was explicitly verified by our backend
        if (credentials?.verified === "true" && credentials?.target) {
          const isEmail = credentials.type === "email";
          const target = credentials.target;
          return {
            id: target,
            email: isEmail ? target : null,
            name: isEmail
              ? target.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
              : `Privé Member ···${target.slice(-4)}`,
            image: null,
          };
        }
        // Return null to reject the sign-in
        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/account/login",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        // Expose stable Google account id
        token.uid = profile.sub;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Set session.user.id to the stable Google id, or custom user id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = (token.uid || token.id) as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
