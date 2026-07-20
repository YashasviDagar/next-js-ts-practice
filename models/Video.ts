import mongoose, { Schema, model, models } from "mongoose";

// Default dimensions used for video transformations
export const VIDEO_DIMENSIONS = {
  width: 1080,
  heigth: 1920,
} as const; // Now this wont be able to change

// Used only for type checking and autocompletion.
export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // URL where the uploaded video is stored
    videoUrl: { type: String, required: true },

    // URL of the video's thumbnail image
    thumbnailUrl: { type: String, required: true },

    // Controls whether the video player shows
    // play, pause, volume, fullscreen, etc.
    controls: { type: Boolean, default: true },

    // Stores video transformation settings
    // used while displaying or processing the video
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.heigth },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      // Video quality (1–100) --- from imagekit
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

// Use the existing model if it already exists;
// otherwise create a new one.
// Prevents OverwriteModelError in Next.js.
const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;