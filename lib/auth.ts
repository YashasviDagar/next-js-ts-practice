import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Name displayed for this authentication provider
      name: "Credentials",

      // Input fields shown on the login form
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // Runs whenever a user attempts to sign in
      async authorize(credentials) {
        // Ensure both email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          // Connect to MongoDB
          await connectToDatabase();

          // Find the user by email
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this");
          }

          // Compare the entered password with the hashed
          // password stored in the database.
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          // Login fails if the passwords don't match
          if (!isValid) {
            throw new Error("invalid password");
          }

          // Return the user object.
          // Returning an object means authentication succeeded.
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error: ", error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    // Called whenever a JWT is created or updated.
    // Add custom data (user id) to the token.
    async jwt({ token, user }) {
      // user is available only during login
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    // Called whenever a session is created.
    // Copy the custom id from the JWT into the session.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  // Custom authentication pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    // Store session data inside a JWT
    // instead of storing sessions in the database.
    strategy: "jwt",

    // Session expires after 30 days
    maxAge: 30 * 24 * 60 * 60,
  },

  // Secret used to sign and verify JWTs
  secret: process.env.NEXTAUTH_SECRET,
};
/**User enters Email & Password
            │
            ▼
authorize()
            │
            ▼
Check MongoDB
            │
            ▼
Compare Password
            │
            ▼
Return User
            │
            ▼
jwt()
Store user.id inside JWT
            │
            ▼
session()
Copy id from JWT → Session
            │
            ▼
session.user.id available everywhere*/