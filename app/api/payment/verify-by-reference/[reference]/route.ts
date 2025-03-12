import { NextRequest, NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import { verifyTransaction } from "@/lib/flutterwave";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.pathname.split('/').pop();
  
  if (!reference) {
    return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
  }

  try {
    // Get orderId from query params
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if request is from admin
    const session = await auth();
    const isAdmin = session?.user?.role === 'admin';

    console.log('🔍 Verifying transaction with reference:', reference);

    // Get verification result
    const { status, data: flutterwaveResponse } = await verifyTransaction(reference);

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db();

    // Find the order
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId),
      // Only check transactionRef match if not admin
      ...((!isAdmin) && { transactionRef: reference })
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If not admin, verify that the user owns this order
    if (!isAdmin && order.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if transaction was not found (cancelled)
    const isCancelled = status === 'cancelled' && flutterwaveResponse === null;

    // Update order based on verification status
    const updateData = {
      $set: {
        paymentStatus: isCancelled ? "cancelled" : status === "successful" ? "completed" : "failed",
        orderStatus: isCancelled ? "cancelled" : status === "successful" ? "processing" : "failed",
        "paymentData.verificationResult": status,
        "paymentData.verifiedAt": new Date(),
        "paymentData.flutterwaveResponse": flutterwaveResponse,
        "paymentData.lastVerificationAttempt": new Date(),
        "paymentData.verifiedBy": session?.user?.id || null,
        updatedAt: new Date()
      }
    };

    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      updateData
    );

    // Prepare payment details for response
    const paymentDetails = {
      paymentReference: reference,
      amount: order.amount,
      paymentMethod: flutterwaveResponse?.data?.payment_type || "Unknown",
      customerEmail: flutterwaveResponse?.data?.customer?.email,
      processorResponse: flutterwaveResponse?.data?.processor_response,
      cardDetails: flutterwaveResponse?.data?.card ? {
        last4: flutterwaveResponse.data.card.last_4digits,
        issuer: flutterwaveResponse.data.card.issuer,
        type: flutterwaveResponse.data.card.type,
      } : undefined
    };

    return NextResponse.json({
      status: status === "successful" ? "successful" : "failed",
      message: status === "successful" 
        ? "Payment verified successfully" 
        : "Payment verification failed",
      paymentDetails
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { 
        status: "failed",
        error: "Failed to verify payment" 
      },
      { status: 500 }
    );
  }
}