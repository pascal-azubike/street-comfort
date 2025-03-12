import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Sync cart items from local storage to database
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const client = await clientPromise
    const db = client.db()

    const wishlistItem = {
      ...body,
      userId: session.user.id,
      createdAt: new Date(),
    }

    await db.collection("wishlist").insertOne(wishlistItem)

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error('[WISHLIST_POST]', error)
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
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    const wishlistItems = await db
      .collection("wishlist")
      .find({ userId: session.user.id })
      .toArray()

    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error('[WISHLIST_GET]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 