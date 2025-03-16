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

    const item = await req.json()
    const client = await clientPromise
    const db = client.db()

    // Check if item already exists in wishlist
    const existingItem = await db.collection("wishlist").findOne({
      userId: session.user.id,
      "items._id": item._id
    })

    if (existingItem) {
      return NextResponse.json(
        { message: "Item already in wishlist" },
        { status: 400 }
      )
    }

    // Add new item to wishlist with availability status
    await db.collection("wishlist").updateOne(
      { userId: session.user.id },
      { 
        $push: { items: { ...item, addedAt: new Date() } },
        $set: { updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    )

    return NextResponse.json({ message: "Item added to wishlist" }, { status: 201 })
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

    // Get wishlist items
    const wishlist = await db
      .collection("wishlist")
      .findOne(
        { userId: session.user.id },
        { projection: { items: 1, _id: 0 } }
      )

    // Check availability for each item
    const items = wishlist?.items || []
    const itemsWithAvailability = await Promise.all(
      items.map(async (item: any) => {
        try {
          // Check if product exists in products collection using ObjectId
          const product = await db.collection("products").findOne({ 
            _id: new ObjectId(item._id)
          })
          return {
            ...item,
            isAvailable: !!product
          }
        } catch (error) {
          console.error(`Error checking availability for product ${item._id}:`, error)
          return {
            ...item,
            isAvailable: false
          }
        }
      })
    )

    return NextResponse.json(itemsWithAvailability)
  } catch (error) {
    console.error('[WISHLIST_GET]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}