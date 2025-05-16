import { NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { auth } from "@/auth";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = client.db();
    
    // Update user's lastActive timestamp
    await db.collection("users").updateOne(
      { email: session.user.email },
      { 
        $set: { 
          lastActive: new Date().toISOString() // Store as ISO string for consistency
        } 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_STATUS_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = client.db();
    
    const users = await db.collection("users")
      .find({}, {
        projection: {
          _id: 1,
          name: 1,
          email: 1,
          lastActive: 1,
        }
      })
      .toArray();

    // Transform lastActive to ISO string for consistent date handling
    const formattedUsers = users.map(user => ({
      ...user,
      lastActive: user.lastActive ? new Date(user.lastActive).toISOString() : null
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("[USER_STATUS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
