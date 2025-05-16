import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" }, 
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Get current session token from the request cookie
    const sessionToken = req.headers.get("x-session-token");

    if (!sessionToken) {
      return NextResponse.json(
        { message: "No session token provided" },
        { status: 400 }
      );
    }

    // Update the session to expire immediately and mark as logged out
    await db.collection("sessions").updateOne(
      { sessionToken },
      {
        $set: {
          expires: new Date(),
          status: "logged_out",
          logoutTime: new Date()
        }
      }
    );

    return NextResponse.json({
      message: "Session expired successfully",
      success: true
    });
  } catch (error) {
    console.error("[SESSION_EXPIRE]", error);
    return NextResponse.json(
      { message: "Failed to expire session", success: false },
      { status: 500 }
    );
  }
}
