import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      preferredContact,
      alternatePhone,
      businessName,
      taxId,
    } = body;

    // Update user in database
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          name,
          email,
          phone,
          preferredContact,
          alternatePhone,
          businessName,
          taxId,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (!result.matchedCount && !result.upsertedCount) {
      return new NextResponse("Failed to update user", { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Internal error", 
        error: error instanceof Error ? error.message : String(error) 
      }), 
      { status: 500 }
    );
  }
} 