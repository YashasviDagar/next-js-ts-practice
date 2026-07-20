import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configuration object for NextAuth
export const authOptions: AuthOptions = {
  providers: [
    // Use email and password authentication
    CredentialsProvider({
      // Name displayed on the sign-in page
      name: "Credentials",

      // Define the input fields shown on the login form
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      // Called whenever a user attempts to sign in.
      async authorize(credentials) {
        // TODO: Add your real database lookup logic here (e.g., MongoDB check)
        
        // Basic fallback for development testing:
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
          };
        }

        // Return null if the credentials are invalid or missing
        return null;
      }
    })
  ],

  // Secret key used to sign and verify JWTs
  secret: process.env.NEXTAUTH_SECRET,

  // Use a custom login page instead of NextAuth's default page
  pages: {
    signIn: "/login",
  }
};

// --- ADDED THIS PART BELOW TO FIX YOUR ROUTE ERRORS ---

// 1. Initialize NextAuth with your auth configuration options
const handler = NextAuth(authOptions);

// 2. Explicitly export the handler for both GET and POST HTTP requests
export { handler as GET, handler as POST };