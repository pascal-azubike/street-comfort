import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get orderId from URL path segments
    const orderId = request.nextUrl.pathname.split('/')[3] // /api/orders/[orderId]/cancel
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Find the order and verify ownership
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId),
      userId: new ObjectId(session.user.id)
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Verify order can be cancelled
    if (order.orderStatus !== "pending") {
      return new NextResponse(
        "Only pending orders can be cancelled", 
        { status: 400 }
      );
    }

    // Update order status
    const updateResult = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          orderStatus: "cancelled",
          paymentStatus: "cancelled",
          "paymentData.cancellationReason": "Cancelled by user",
          "paymentData.cancelledAt": new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (!updateResult.modifiedCount) {
      return new NextResponse(
        "Failed to cancel order", 
        { status: 500 }
      );
    }

    // Fetch the updated order
    const updatedOrder = await db.collection("orders").findOne({
      _id: new ObjectId(orderId)
    });

    return NextResponse.json({
      message: "Order cancelled successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    return new NextResponse(
      "Internal server error", 
      { status: 500 }
    );
  }
} 