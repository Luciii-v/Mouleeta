export const dynamic = 'force-dynamic';
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminAuth } from "@/lib/firebase-admin";
import { consumeOtp, normalizeEmail } from "@/lib/otp";
import { isRateLimited, requestAddress } from "@/lib/rate-limit";

const AUTH_SECURITY_VERSION = 2;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // OTP-Verified Session Provider
    // The server validates the submitted email OTP or Firebase ID token. Never
    // trust a client-supplied "verified" boolean for authentication.
    CredentialsProvider({
      id: "otp-verified",
      name: "OTP Verified",
      credentials: {
        target: { label: "Target", type: "text" },
        type: { label: "Type", type: "text" },
        otp: { label: "OTP", type: "text" },
        firebaseIdToken: { label: "Firebase ID token", type: "text" },
      },
      async authorize(credentials, request) {
        const type = credentials?.type;
        const targetCredential = credentials?.target;
        const otpCredential = credentials?.otp;
        const firebaseIdToken = credentials?.firebaseIdToken;

        if (type === "email" && targetCredential && otpCredential) {
          const target = normalizeEmail(targetCredential);
          if (!target || !/^\d{6}$/.test(otpCredential.trim())) return null;
          const client = requestAddress({ headers: new Headers(request.headers) });
          try {
            if (
              await isRateLimited(`otp-login:ip:${client}`, 30, 10 * 60 * 1000) ||
              await isRateLimited(`otp-login:target:${target}`, 15, 10 * 60 * 1000)
            ) return null;
            const result = await consumeOtp(target, otpCredential.trim(), "sign-in");
            if (!result.ok) return null;
          } catch {
            return null;
          }

          return {
            id: `email:${target}`,
            email: target,
            name: target
              .split("@")[0]
              .replace(/[._-]/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
            image: null,
          };
        }

        if (type === "phone" && firebaseIdToken && firebaseIdToken.length <= 10000 && adminAuth) {
          try {
            const client = requestAddress({ headers: new Headers(request.headers) });
            if (await isRateLimited(`phone-login:ip:${client}`, 30, 10 * 60 * 1000)) return null;
            const decoded = await adminAuth.verifyIdToken(firebaseIdToken, true);
            const phoneNumber = decoded.phone_number;
            const authAge = Date.now() / 1000 - decoded.auth_time;
            if (!phoneNumber || decoded.firebase.sign_in_provider !== "phone" || authAge < -60 || authAge > 300) return null;

            return {
              id: `firebase:${decoded.uid}`,
              email: decoded.email_verified ? decoded.email ?? null : null,
              name: `Privé Member ···${phoneNumber.slice(-4)}`,
              image: null,
            };
          } catch {
            return null;
          }
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
        token.securityVersion = AUTH_SECURITY_VERSION;
      }
      return token;
    },
    async session({ session, token }) {
      // Reject sessions minted by the former client-trusting provider. A
      // deploy requires users to authenticate again; do not upgrade old JWTs.
      if (token.securityVersion !== AUTH_SECURITY_VERSION) {
        delete session.user;
        return session;
      }
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
