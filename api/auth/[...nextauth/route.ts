import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configuration object for NextAuth
export const authOptions: AuthOptions = {
  providers: [

    // Use email and password authentication
    // instead of OAuth providers like Google or GitHub.
    CredentialsProvider({

      // Name displayed on the sign-in page
      name: "Credentials",

      // Define the input fields shown on the login form
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      // Called whenever a user attempts to sign in.
      // Here you verify the user's credentials
      // (e.g., by checking MongoDB).
      async authorize(credentials) {

        // Return the user object if authentication succeeds.
        // Return null if the credentials are invalid.
        return null;
      }
    })
  ],

  // Secret key used to sign and verify JWTs,
  // encrypt session data, and secure authentication.
  secret: process.env.NEXTAUTH_SECRET,

  // Use a custom login page instead of NextAuth's default page
  pages: {
    signIn: "/login",
  }
};