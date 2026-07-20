import { IVideo } from "@/models/Video";

// Create a new type from IVideo by removing the "_id" field.
// We don't send "_id" when creating a new video because
// MongoDB automatically generates it.
export type VideoFormData = Omit<IVideo, "_id">;

// Options that can be passed to the fetch method
type FetchOptions = {
  // Allowed HTTP methods
  method?: "GET" | "POST" | "PUT" | "DELETE";

  // Request body (data to send)
  body?: any;

  // Additional request headers
  headers?: Record<string, string>;
};

// API client class to centralize all API requests.
// Instead of writing fetch() everywhere,
// we create reusable methods here.
class ApiClient {
  // Generic fetch method.
  // <T> allows the caller to specify the expected response type.
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> {
    // Extract options and provide default values
    const { method = "GET", body, headers = {} } = options;

    // Default headers for every request.
    // User-provided headers overwrite defaults if needed.
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Send the HTTP request
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,

      // Convert the request body into JSON if it exists
      body: body ? JSON.stringify(body) : undefined,
    });

    // Throw an error if the request failed
    if (!response.ok) {
      throw new Error(await response.text());
    }

    // Convert the JSON response into a JavaScript object
    return response.json();
  }

  // Fetch all videos
  async getVideos() {
    return this.fetch("/videos");
  }

  // Create a new video
  async createVideo(videoData: VideoFormData) {
    return this.fetch("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

// Export a single instance of ApiClient.
// This instance can be imported and reused
// throughout the application.
export const apiClient = new ApiClient();
/**React Component
        │
        ▼
apiClient.getVideos()
        │
        ▼
this.fetch()
        │
        ▼
fetch("/api/videos")
        │
        ▼
Next.js API Route
        │
        ▼
Database
        │
        ▼
Response
        │
        ▼
fetch<T>()
        │
        ▼
JavaScript Object
        │
        ▼
React Component */
