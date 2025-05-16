import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.user.id) },
      {
        projection: {
          name: 1,
          email: 1,
          phone: 1,
          preferredContact: 1,
          alternatePhone: 1,
          businessName: 1,
          taxId: 1,
        }
      }
    );

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Internal error", 
        error: error instanceof Error ? error.message : String(error) 
      }), 
      { status: 500 }
    );
  }
} 