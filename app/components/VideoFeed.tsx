import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

// Defines the props expected by this component.
// It receives an array of videos.
interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    // Responsive grid layout:
    // 1 column on small screens
    // 2 columns on small devices
    // 3 columns on medium devices
    // 4 columns on large devices
    // gap-4 adds spacing between cards
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Loop through each video and render a VideoComponent */}
      {videos.map((video) => (
        // key helps React uniquely identify each item in the list.
        // React uses it to efficiently update only the items that changed.
        <VideoComponent key={video._id?.toString()} video={video} />
      ))}

      {/* If there are no videos, display a message */}
      {videos.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70">No videos found</p>
        </div>
      )}
    </div>
  );
}
/**Parent Component
        │
        ▼
Pass videos[]
        │
        ▼
VideoFeed
        │
        ▼
videos.map()
        │
        ▼
Loop Through Each Video
        │
        ▼
VideoComponent
        │
        ▼
Grid Layout
        │
        ▼
Rendered on Screen

If videos = []

        │
        ▼
"No videos found" */
