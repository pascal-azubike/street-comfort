import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.pathname.split('/')[3]; // /api/users/[userId]/details
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const admin = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
      role: "admin"
    });

    if (!admin) {
      return new NextResponse("Unauthorized - Admin access required", { status: 401 });
    }

    // Get user details
    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get user's addresses
    const addresses = await db.collection("addresses")
      .find({ userId: new ObjectId(userId) })
      .toArray();

    // Get user's cart items with product details
    const cart = await db.collection("carts").findOne({
      userId: new ObjectId(userId)
    });

    // Get user's wishlist items
    const wishlist = await db.collection("wishlists").findOne({
      userId: new ObjectId(userId)
    });

    // Get user's orders with all details
    const orders = await db.collection("orders")
      .find({
        userId: new ObjectId(userId)
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log('API Response:', {
      ordersCount: orders.length,
      sampleOrder: orders[0],
      cartItems: cart?.items?.length,
      wishlistItems: wishlist?.items?.length
    });

    return NextResponse.json({
      user: {
        ...user,
        password: undefined
      },
      addresses,
      cartItems: cart?.items || [],
      wishlistItems: wishlist?.items || [],
      orders
    });

  } catch (error) {
    console.error('[USER_DETAILS]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 