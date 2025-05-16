import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
    const addressId = request.nextUrl.pathname.split('/').pop()
    
    if (!addressId) {
        return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }

    try {
        // Get the request body with partial updates
        const body = await request.json()
        
        // Your patch logic here
        return NextResponse.json({ message: "Address partially updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
  const addressId = request.nextUrl.pathname.split('/').pop()
  
  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
  }

  try {
    const session = await auth();
    console.log("DELETE request received for address ID:", addressId);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await db.collection("addresses").deleteOne({
      _id: new ObjectId(addressId),
      userId: new ObjectId(session.user.id),
    });

    if (!result.deletedCount) {
      return new NextResponse("Address not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("[ADDRESS_DELETE]", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal error",
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const addressId = request.nextUrl.pathname.split('/').pop()
  
  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
  }

  try {
    console.log("GET request received for address ID:", addressId);

    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const address = await db.collection("addresses").findOne({
      _id: new ObjectId(addressId),
      
      userId: new ObjectId(session.user.id),
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 404 });
    }

    return NextResponse.json({
      ...address,
      _id: address._id.toString(),
      userId: address.userId.toString(),
    });
  } catch (error) {
    console.error("[ADDRESS_GET]", error, {
      error: error instanceof Error ? error.message : String(error),
    });
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const addressId = request.nextUrl.pathname.split('/').pop()
  
  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
  }

  try {
    // Get the request body
    const body = await request.json()
    
    // Your post logic here
    return NextResponse.json({ message: "Address updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}
