import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/loginUser`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok) throw new Error(data.message);

          return {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            plan: data.user.plan,
            token: data.token,
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Login failed");
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/upsertUser`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user.image,
              }),
            }
          );
        } catch {
          // Backend not running yet — sign in still succeeds
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          // Fetch _id, plan and a signed token from Express
          try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/fetchUser?email=${user.email}`;
            console.log("Fetching me from:", url);

            const res = await fetch(url);
            const data = await res.json();

            console.log("me response status:", res.status);
            console.log("me response data:", data);

            if (res.ok) {
              token._id = data._id;
              token.plan = data.plan;
              token.token = data.token;
            } else {
              console.error("me endpoint failed:", data);
            }
          } catch (error) {
            console.error("me fetch error:", error);
            token.plan = "free";
          }
        } else {
          // Credentials login — token comes directly from Express /api/auth/login
          token._id = (user as any).id;
          token.plan = (user as any).plan;
          token.token = (user as any).token;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.plan = (token.plan as "free" | "pro") ?? "free";
        session.user.token = token.token as string;
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };