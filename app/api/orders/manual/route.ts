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
    const { receiptUrl, transactionRef, amount, items, addressId } = body;

    if (!receiptUrl || !transactionRef || !amount || !items || !addressId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Fetch the address details
    const address = await db.collection("addresses").findOne({
      _id: new ObjectId(addressId),
      userId: new ObjectId(session.user.id),
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 404 });
    }

    const orderItems = items.map((item: any) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      size: item.size,
      image: item.image,
      description: item.description,
      category: item.category,
      details: item.details,
      images: item.images
    }));

    // Create order with manual payment details and additional status fields
    const order = await db.collection("orders").insertOne({
      userId: new ObjectId(session.user.id),
      orderItems,
      amount,
      paymentStatus: "pending",
      paymentType: "manual",
      orderStatus: "pending",
      deliveryStatus: "not-started",
      transactionRef,
      receiptUrl,
      address: {
        _id: address._id,
        type: address.type,
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        landmark: address.landmark,
        instructions: address.instructions,
      },
      deliveryDetails: {
        isDelivered: false,
        deliveredAt: null,
        estimatedDeliveryDate: null,
        trackingNumber: null
      },
      paymentData: {
        verificationResult: null,
        verifiedAt: null,
        lastVerificationAttempt: null
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Order created successfully",
      orderId: order.insertedId,
    });
  } catch (error) {
    console.error("Error creating manual order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
