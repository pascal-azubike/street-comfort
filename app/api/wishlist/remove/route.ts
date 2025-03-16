import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await req.json()
    const client = await clientPromise
    const db = client.db()

    // Remove item from wishlist
    await db.collection("wishlist").updateOne(
      { userId: session.user.id },
      { 
        $pull: { items: { _id: itemId } },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({ message: "Item removed from wishlist" }, { status: 200 })
  } catch (error) {
    console.error('[WISHLIST_REMOVE]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
