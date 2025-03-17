import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId, PullOperator } from "mongodb"

interface WishlistItem {
  _id: string
  name: string
  price: string
  size: string
  image: string
  category: string
  addedAt?: Date
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await req.json()
    const client = await clientPromise
    const db = client.db()

    // Remove item from wishlist
    await db.collection("wishlist").updateOne(
      { userId: new ObjectId(session.user.id) },
      { 
        $pull: { 
          items: { _id: itemId } as WishlistItem 
        } as PullOperator<{ items: WishlistItem[] }>,
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
