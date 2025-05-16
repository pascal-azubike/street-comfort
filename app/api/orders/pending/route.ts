import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Add OrderStatus type
type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { items, amount, transactionRef, addressId } = await req.json();

    if (!addressId) {
      return new NextResponse("Delivery address is required", { status: 400 });
    }

    // Fetch the address details
    const address = await db.collection("addresses").findOne({
      _id: new ObjectId(addressId)
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
      details: item.details || [],
      images: item.images
    }));

    const order = await db.collection("orders").insertOne({
      userId: new ObjectId(session.user.id),
      orderItems,
      amount,
      transactionRef,
      address: {
        _id: address._id,
        type: address.type,
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        landmark: address.landmark,
        instructions: address.instructions
      },
      paymentStatus: 'pending',
      orderStatus: 'pending',
      deliveryStatus: 'not-started',
      createdAt: new Date(),
      updatedAt: new Date(),
      attempts: [],
      deliveryDetails: {
        isDelivered: false,
        deliveredAt: null,
        estimatedDeliveryDate: null,
        trackingNumber: null,
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.insertedId.toString(),
    });
  } catch (error) {
    console.error("[PENDING_ORDER_CREATE]", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Internal error", 
        error: error instanceof Error ? error.message : String(error) 
      }), 
      { status: 500 }
    );
  }
} 