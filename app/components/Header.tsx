"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  // Get the current logged-in user's session
  const { data: session } = useSession();

  // Access the notification function from the Notification context
  const { showNotification } = useNotification();

  // Handles user sign out
  const handleSignOut = async () => {
    try {
      // Sign the user out using NextAuth
      await signOut();

      // Show a success notification
      showNotification("Signed out successfully", "success");
    } catch {
      // Show an error notification if sign out fails
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 z-40">
      <div className="container mx-auto">
        <div className="flex-1 px-2 lg:flex-none">
          {/* Navigate to the home page */}
          <Link
            href="/"
            className="btn btn-ghost text-xl gap-2 normal-case font-bold"
            // Prefetch the page in the background
            // so navigation feels faster.
            prefetch={true}
            onClick={() =>
              showNotification("Welcome to ImageKit ReelsPro", "info")
            }
          >
            <Home className="w-5 h-5" />
            Video with AI
          </Link>
        </div>

        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch gap-2">
            <div className="dropdown dropdown-end">
              {/* User profile button */}
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <User className="w-5 h-5" />
              </div>

              {/* Dropdown menu */}
              <ul
                tabIndex={0}
                className="dropdown-content z-1 shadow-lg bg-base-100 rounded-box w-64 mt-4 py-2"
              >
                {/* Show different options depending on whether
                    the user is logged in or not */}
                {session ? (
                  <>
                    {/* Display the username (before @ in email) */}
                    <li className="px-4 py-1">
                      <span className="text-sm opacity-70">
                        {session.user?.email?.split("@")[0]}
                      </span>
                    </li>

                    <div className="divider my-1"></div>

                    <li>
                      {/* Navigate to the upload page */}
                      <Link
                        href="/upload"
                        className="px-4 py-2 hover:bg-base-200 block w-full"
                        onClick={() =>
                          showNotification("Welcome to Admin Dashboard", "info")
                        }
                      >
                        Video Upload
                      </Link>
                    </li>

                    <li>
                      {/* Sign the user out */}
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-error hover:bg-base-200 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  // Show login button if no user is logged in
                  <li>
                    <Link
                      href="/login"
                      className="px-4 py-2 hover:bg-base-200 block w-full"
                      onClick={() =>
                        showNotification("Please sign in to continue", "info")
                      }
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/**App Starts
      │
      ▼
SessionProvider
      │
      ▼
Header
      │
      ▼
useSession()
      │
      ▼
Is User Logged In?
      │
 ┌────┴────┐
 │         │
Yes        No
 │         │
 ▼         ▼
Show      Show
Upload    Login
Sign Out
      │
      ▼
User clicks Sign Out
      │
      ▼
signOut()
      │
      ▼
Session Deleted
      │
      ▼
Header Re-renders
      │
      ▼
Login Button Appears */