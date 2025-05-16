import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { paymentId, amount, items, paymentStatus, paymentMethod } = body;

    // Create order in database
    const order = await db.collection("orders").insertOne({
      userId: new ObjectId(session.user.id),
      paymentId,
      amount,
      items,
      paymentStatus,
      paymentMethod,
      createdAt: new Date(),
      status: 'processing',
    });

    return NextResponse.json({
      success: true,
      orderId: order.insertedId,
    });
  } catch (error) {
    console.error("[ORDER_CREATE]", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal error",
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const status = searchParams.get("status");

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Build query
    const query = {
      userId: new ObjectId(session.user.id),
      ...(status && { orderStatus: status }),
    };

    // Get total count
    const total = await db.collection("orders").countDocuments(query);

    // Get paginated orders
    const orders = await db.collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({
      orders,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse(
      "Internal server error", 
      { status: 500 }
    );
  }
} 