import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      try {
        // Once the Express backend is running, this will upsert the user
        // in MongoDB and return the user's _id and plan
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/upsert-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
          }),
        });
      } catch {
        // Backend not running yet — sign in still succeeds,
        // plan will default to "free" from the JWT callback below
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Try to get the user's _id and plan from the backend
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me?email=${user.email}`,
          );

          if (res.ok) {
            const data = await res.json();
            token._id = data._id;
            token.plan = data.plan;
          }
        } catch {
          // Backend not running yet — default to free
          token.plan = "free";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.plan = (token.plan as "free" | "pro") ?? "free";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
