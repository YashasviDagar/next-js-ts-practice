import { Connection } from "mongoose";

// Extend the global object by adding a custom mongoose property.
// This lets us store and reuse the database connection across multiple requests or hot reloads in Next.js.
declare global {
  var mongoose: {
    // Stores the active database connection
    conn: Connection | null;

    // Stores the connection promise while a connection
    // is being established to avoid creating multiple connections.
    promise: Promise<Connection> | null;
  };
}

// Marks this file as a module so the global declaration doesn't pollute the global scope.
export {};

// Server starts
//       │
//       ▼
// Connect to MongoDB once 
//       │
//       ▼
// Use the same connection forever