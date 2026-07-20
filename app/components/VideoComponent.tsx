import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

// Component responsible for displaying a single video card
// It receives one video object as a prop.
export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    // Card container
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        {/* Clicking the video navigates to the video's detail page */}
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          {/* Container that maintains a 9:16 aspect ratio */}
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            {/* ImageKit video player */}
            <IKVideo
              // Path of the uploaded video stored in ImageKit
              path={video.videoUrl}
              // Resize the streamed video before displaying it.
              // ImageKit performs this transformation on the fly.
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              // Show or hide the default video controls
              controls={video.controls}
              // Make the video fill its container
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        {/* Clicking the title also opens the video page */}
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        {/* Display the video description.
            line-clamp-2 limits the text to 2 lines
            and adds "..." if it overflows. */}
        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}

/**Parent Component
        │
        ▼
Pass video prop
        │
        ▼
VideoComponent
        │
        ├───────────────┐
        │               │
        ▼               ▼
IKVideo         Title & Description
        │               │
        ▼               ▼
ImageKit       Database Data
        │
        ▼
Video Displayed
        │
        ▼
User Clicks
        │
        ▼
Next.js Link
        │
        ▼
/videos/{id} */
