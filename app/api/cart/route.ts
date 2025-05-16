import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Sync cart items from local storage to database
export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Update or insert cart items
    await db.collection("carts").updateOne(
      { userId: new ObjectId(session.user.id) },
      {
        $set: {
          items: body.items,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ message: "Cart synced successfully" })
  } catch (error) {
    console.error('[CART_SYNC]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// Get cart items for logged-in user
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ items: [] })
    }

    const client = await clientPromise
    const db = client.db()

    const cart = await db.collection("carts").findOne({
      userId: new ObjectId(session.user.id)
    })

    return NextResponse.json({ items: cart?.items || [] })
  } catch (error) {
    console.error('[CART_GET]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 