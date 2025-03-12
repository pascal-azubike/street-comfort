import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.pathname.split('/').pop()
    
    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId)
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...product,
      _id: product._id.toString(),
      images: product.images || []
    })

  } catch (error) {
    console.error('[PRODUCT_GET]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const productId = request.nextUrl.pathname.split('/').pop()
    
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify admin role
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    })

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized - Admin access required", { status: 401 })
    }

    // Check if product exists
    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId)
    })

    if (!product) {
      return new NextResponse("Product not found", { status: 404 })
    }

    // Delete the product
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(productId)
    })

    if (!result.deletedCount) {
      return new NextResponse("Failed to delete product", { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    })

  } catch (error) {
    console.error('[PRODUCT_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const productId = request.nextUrl.pathname.split('/').pop()
    
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    })

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized - Admin access required", { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.description || !body.category || !body.images?.length) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { 
        $set: {
          ...body,
          updatedAt: new Date(),
        }
      }
    )

    if (!result.matchedCount) {
      return new NextResponse("Product not found", { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully"
    })

  } catch (error) {
    console.error('[PRODUCT_UPDATE]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}