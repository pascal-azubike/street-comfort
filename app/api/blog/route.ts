import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const ITEMS_PER_PAGE = 6

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const cursor = searchParams.get("cursor")

    const client = await clientPromise
    const db = client.db()

    const query = cursor 
      ? { _id: { $lt: new ObjectId(cursor) } }
      : {}

    const posts = await db.collection("posts")
      .find(query)
      .sort({ _id: -1 })
      .limit(ITEMS_PER_PAGE + 1) // Get one extra to check if there's more
      .toArray()

    const hasNextPage = posts.length > ITEMS_PER_PAGE
    const items = hasNextPage ? posts.slice(0, -1) : posts

    return NextResponse.json({
      items: items.map(post => ({
        ...post,
        _id: post._id.toString()
      })),
      nextCursor: hasNextPage ? items[items.length - 1]._id : undefined
    })

  } catch (error) {
    console.error('[BLOG_GET]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const blogData = await req.json()
    
    // Add timestamps
    const now = new Date()
    const enrichedData = {
      ...blogData,
      createdAt: now,
      updatedAt: now
    }

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("posts").insertOne(enrichedData)

    return NextResponse.json({
      _id: result.insertedId.toString(),
      message: "Blog post created successfully"
    })

  } catch (error) {
    console.error('[BLOG_POST]', error)
    return NextResponse.json(
      { message: "Failed to create blog post" },
      { status: 500 }
    )
  }
} 