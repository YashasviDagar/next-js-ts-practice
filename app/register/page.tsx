"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

function RegisterPage() {
  // State variables to store the user's input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Used to navigate between pages programmatically
  const router = useRouter();

  // Handles form submission
  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevents the browser from refreshing the page
    // when the form is submitted.
    e.preventDefault();

    // Ensure both password fields match
    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }
    try {
      // Send the registration data to the backend API
      const res = await fetch("/api/auth/register", {
        method: "POST",

        // Inform the server that we're sending JSON data
        headers: {
          "Content-Type": "application/json",
        },

        // Convert the JavaScript object into a JSON string
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Convert the response into a JavaScript object
      const data = await res.json();

      // If the request failed, throw an error
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log(data);

      // Redirect the user to the login page
      // after successful registration.
      router.push("/login");
    } catch (error) {
      // Handle any errors during registration
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {/* Call handleSubmit when the form is submitted */}
      <form onSubmit={handleSumit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          // Update the email state whenever the user types
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          // Update the password state
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          // Update the confirm password state
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      <div>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
/**User fills form
        │
        ▼
Click Register
        │
        ▼
preventDefault()
        │
        ▼
Passwords Match?
        │
   No ─────► Alert
        │
       Yes
        │
        ▼
fetch()
        │
        ▼
POST /api/auth/register
        │
        ▼
Database
        │
        ▼
Success Response
        │
        ▼
router.push("/login")
        │
        ▼
Login Page */