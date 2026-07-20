import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// Stop the application if the connection string is missing
if (!MONGODB_URI) {
  throw new Error("Please define mongo_uri in env variables");
}

// Access the globally cached mongoose connection
let cached = global.mongoose;

// If no cache exists yet, initialize it
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {

  // If a database connection already exists,
  // reuse it instead of creating a new one.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is not currently being established,
  // create one and store the promise.
  if (!cached.promise) {

    // Mongoose connection options
    const opts = {

      // Buffers database operations until the connection is established
      bufferCommands: true,

      // Maximum number of connections kept in the connection pool
      maxPoolSize: 10,
    };

    // Start connecting to MongoDB and save the promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    // Wait for the connection to complete
    // and store the active connection.
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, clear the promise
    // so the next request can retry.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**connectToDatabase()
        │
        ▼
Already connected?
        │
   Yes ─────► Return existing connection
        │
        No
        ▼
Connection in progress?
        │
   Yes ─────► Wait for that promise
        │
        No
        ▼
Start new connection
        │
        ▼
Save promise
        │
        ▼
Wait for connection
        │
        ▼
Save connection
        │
        ▼
Return connection */