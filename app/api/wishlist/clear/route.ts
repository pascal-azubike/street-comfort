import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Clear all items from wishlist
    await db.collection("wishlist").updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          items: [],
          updatedAt: new Date() 
        }
      }
    )

    return NextResponse.json({ message: "Wishlist cleared" }, { status: 200 })
  } catch (error) {
    console.error('[WISHLIST_CLEAR]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
