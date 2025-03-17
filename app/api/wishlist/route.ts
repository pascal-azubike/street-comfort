import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface WishlistItem {
  _id: string
  name: string
  price: string
  size: string
  image: string
  category: string
  addedAt?: Date
}

interface Wishlist {
  _id: ObjectId
  userId: ObjectId
  items: WishlistItem[]
  createdAt: Date
  updatedAt: Date
}

// Get wishlist items for logged-in user
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get wishlist items
    const wishlist = await db
      .collection("wishlist")
      .findOne({
        userId: new ObjectId(session.user.id)
      })

    const currentWishlist = wishlist || { items: [] }

    // Check availability for each item
    const itemsWithAvailability = await Promise.all(
      currentWishlist.items.map(async (item: WishlistItem) => {
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

    return NextResponse.json({
      items: itemsWithAvailability
    })
  } catch (error) {
    console.error('[WISHLIST_GET]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// Add item to wishlist
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const item = await req.json() as WishlistItem
    const client = await clientPromise
    const db = client.db()

    // Check if product exists in products collection
    const product = await db.collection("products").findOne({ 
      _id: new ObjectId(item._id)
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    // Check if user already has a wishlist
    const wishlist = await db.collection("wishlist").findOne({
      userId: new ObjectId(session.user.id)
    })

    // Check if item already exists in wishlist
    if (wishlist?.items?.some(i => i._id === item._id)) {
      return NextResponse.json(
        { message: "Item already in wishlist" },
        { status: 400 }
      )
    }

    // Create or update wishlist
    await db.collection("wishlist").updateOne(
      { userId: new ObjectId(session.user.id) },
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