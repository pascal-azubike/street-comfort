import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  // Get orderId from URL path segments
  const orderId = request.nextUrl.pathname.split('/')[3] // /api/orders/[orderId]/status
  
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json()
    
    const { status, paymentData, flutterwaveResponse } = body;
    let paymentStatus = status?.toLowerCase() || 'unknown';
    let orderStatus = 'pending';
    let deliveryStatus = 'not-started';

    let failureReason = null;

    switch (paymentStatus) {
      case 'successful':
        paymentStatus = 'completed';
        orderStatus = 'processing';
        deliveryStatus = 'pending';
        break;

      case 'failed':
        paymentStatus = 'failed';
        orderStatus = 'failed';
        deliveryStatus = 'cancelled';
        failureReason = flutterwaveResponse.processor_response || 'Payment failed';
        break;

      case 'cancelled':
        paymentStatus = 'cancelled';
        orderStatus = 'cancelled';
        deliveryStatus = 'cancelled';
        failureReason = 'Payment cancelled';
        break;

      default:
        paymentStatus = 'pending';
        orderStatus = 'pending';
        deliveryStatus = 'not-started';
    }
    const updateData: any = {
      paymentStatus: status,
      orderStatus: orderStatus,
      deliveryStatus: deliveryStatus,
      failureReason: failureReason,
      updatedAt: new Date(),
    };

    if (paymentData) {
      updateData.paymentData = paymentData;
    }

    if (flutterwaveResponse) {
      updateData.flutterwaveResponse = flutterwaveResponse;
    }

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData }
    );

    if (!result.matchedCount) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error('[ORDER_STATUS_UPDATE]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 