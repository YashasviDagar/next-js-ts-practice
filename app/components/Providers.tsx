"use client";
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

// ImageKit URL endpoint from the environment variables.
// The "!" tells TypeScript that this value will definitely exist.
const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

// This component wraps the entire application
// and provides global services like authentication
// and ImageKit to all child components.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Makes the user's authentication session
    // available throughout the application.
    // refetchInterval={5 * 60} refreshes the session
    // every 5 minutes to keep it up to date.
    <SessionProvider refetchInterval={5 * 60}>
      {/* Makes ImageKit available throughout the app.
          Components inside can use ImageKit features
          like optimized image rendering and uploads. */}
      <ImageKitProvider urlEndpoint={urlEndPoint}>{children}</ImageKitProvider>
    </SessionProvider>
  );
}

/**Application Starts
        │
        ▼
Providers
        │
 ┌──────┴────────┐
 │               │
 ▼               ▼
SessionProvider  ImageKitProvider
 │               │
 │               │
Provides         Provides
Session          ImageKit Config
 │               │
 └──────┬────────┘
        ▼
     Children
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Home   Upload   Profile */
