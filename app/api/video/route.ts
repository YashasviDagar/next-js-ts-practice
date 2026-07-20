import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Handles GET requests to fetch all videos
export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Fetch all videos from the database,
    // sort them by newest first,
    // and convert Mongoose documents into plain JavaScript objects.
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    // If no videos exist, return an empty array
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Return the list of videos
    return NextResponse.json(videos);
  } catch (error) {
    // Handle any errors while fetching videos
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

// Handles POST requests to create a new video
export async function POST(request: NextRequest) {
  try {
    // Get the current logged-in user's session
    const session = await getServerSession(authOptions);

    // Only authenticated users can create videos
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Read the request body
    const body: IVideo = await request.json();

    // Validate the required fields
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Prepare the data before saving.
    // If controls or quality are not provided,
    // use the default values.
    const videoData = {
      ...body,

      // Use the provided controls value,
      // otherwise default to true.
      controls: body?.controls ?? true,

      transformation: {
        // Default dimensions
        height: 1920,
        width: 1080,

        // Use the provided quality,
        // otherwise default to 100.
        quality: body.transformation?.quality ?? 100,
      },
    };

    // Create a new video document
    const newVideo = await Video.create(videoData);

    // Return the newly created video
    return NextResponse.json(newVideo);
  } catch (error) {
    // Handle any errors while creating the video
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 },
    );
  }
}
