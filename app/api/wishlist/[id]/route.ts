import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');
    
    if (!itemId) {
      return NextResponse.json({ message: "Item ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection("wishlist").updateOne(
      { userId: session.user.id },
      { $pull: { items: { _id: new ObjectId(itemId) } } } as any
    );

    return NextResponse.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error('[WISHLIST_DELETE]', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 