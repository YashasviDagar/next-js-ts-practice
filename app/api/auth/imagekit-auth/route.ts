import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    // Generate authentication parameters required by ImageKit.
    // These parameters securely authorize the client to upload files
    // without exposing the private key.
    const authenticationParameters = getUploadAuthParams({
      // Private key is used on the server to generate
      // the authentication signature.
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,

      // Public key is safe to send to the client.
      // It identifies your ImageKit account.
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });

    // Return the authentication parameters and public key
    // to the frontend so it can upload files securely.
    return Response.json({
      authenticationParameters,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    // Handle any errors while generating authentication parameters
    return Response.json(
      {
        error: "Authentication for Imagekit failed",
      },
      { status: 500 },
    );
  }
}

/**Browser
      │
      ▼
Request authentication
      │
      ▼
Your Next.js API (Server)
      │
      ▼
Uses Private Key
      │
      ▼
Generates:
• token
• signature
• expire
      │
      ▼
Returns them to browser
      │
      ▼
Browser uploads securely to ImageKit */
