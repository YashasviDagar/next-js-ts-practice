"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
  // State variables to store the user's input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Used to navigate between pages programmatically
  const router = useRouter();

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the browser from refreshing the page
    e.preventDefault();

    // Attempt to sign in using the Credentials provider.
    // redirect: false prevents NextAuth from automatically
    // redirecting the user after login.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // If authentication fails, NextAuth returns an error
    if (result?.error) {
      console.log(result.error);
    } else {
      // Login successful, navigate to the home page
      router.push("/");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      {/* Call handleSubmit when the form is submitted */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          // Update the email state whenever the user types
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          // Update the password state
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <div>
        Don't have an account ?{/* Navigate to the registration page */}
        <button onClick={() => router.push("/register")}>Register</button>
      </div>
    </div>
  );
}

export default LoginPage;
/**User enters Email & Password
            │
            ▼
Click Login
            │
            ▼
handleSubmit()
            │
            ▼
preventDefault()
            │
            ▼
signIn("credentials")
            │
            ▼
authorize()
            │
            ▼
Check MongoDB
            │
            ▼
Password Correct?
      ┌───────────────┐
      │               │
     No              Yes
      │               │
      ▼               ▼
Return Error      Create JWT
                      │
                      ▼
               Create Session
                      │
                      ▼
             result returned
                      │
      ┌───────────────┐
      │               │
 Error Exists      No Error
      │               │
      ▼               ▼
console.log()    router.push("/") */
