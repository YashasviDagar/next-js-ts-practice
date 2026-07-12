import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Extract email and password from the request body
    const { email, password } = await request.json();

    // Ensure both fields are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Establish a connection to the database
    await connectToDatabase();

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 },
      );
    }

    // Create a new user.
    // The password will be automatically hashed
    // by the pre-save middleware in the User model.
    await User.create({
      email,
      password,
    });

    // Send a success response after successful registration
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }, // Should be 201 (Created)
    );
  } catch (error) {
    // Handle any unexpected errors during registration
    console.error("Registration error", error);

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }, // Should be 500 (Internal Server Error)
    );
  }
}
