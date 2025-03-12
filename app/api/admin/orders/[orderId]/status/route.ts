import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  // Get orderId from URL path segments
  const orderId = request.nextUrl.pathname.split('/')[4] // /api/admin/orders/[orderId]/status
  
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
  }

  try {
    const session = await auth();
    
    // First check if user is authenticated
    if (!session?.user?.id) {
      console.log("Unauthorized - User not authenticated");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database to check role
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    });

    // Check if user exists and is admin
    if (!user || user.role !== "admin") {
      console.log("Unauthorized - Admin access required");
      return new NextResponse("Unauthorized - Admin access required", { status: 401 });
    }

    const body = await request.json()
    
    // Validate the order exists
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId)
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Build update object based on provided status types
    const updateObj: any = {
      updatedAt: new Date(),
      "paymentData.lastStatusUpdate": new Date(),
      "paymentData.statusUpdatedBy": session.user.id
    };

    if (body.paymentStatus) updateObj.paymentStatus = body.paymentStatus;
    if (body.orderStatus) updateObj.orderStatus = body.orderStatus;
    if (body.deliveryStatus) updateObj.deliveryStatus = body.deliveryStatus;

    // Update order status
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateObj }
    );

    if (!result.matchedCount) {
      return new NextResponse("Failed to update order", { status: 500 });
    }

    // Get updated order
    const updatedOrder = await db.collection("orders").findOne({
      _id: new ObjectId(orderId)
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('[ADMIN_ORDER_STATUS_UPDATE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 