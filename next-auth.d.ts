import NextAuth, { DefaultSession } from "next-auth";

// Extend NextAuth's default Session type.
// This allows session.user to include a custom "id" property
// in addition to the default user fields (name, email, image).
declare module "next-auth" {
  interface Session {
    user: {

      // Custom user ID added to the session
      id: string;

    } & DefaultSession["user"];
  }
}