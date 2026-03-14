import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: "free" | "pro";
    };
  }

  interface JWT {
    _id: string;
    plan: "free" | "pro";
  }
}
