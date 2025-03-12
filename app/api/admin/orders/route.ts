import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status');

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Build query based on status filter
    const query = status ? { orderStatus: status } : {};

    // Get total count
    const total = await db.collection("orders").countDocuments(query);

    // Get orders with pagination and user details
    const orders = await db.collection("orders")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            orderItems: 1,
            amount: 1,
            paymentStatus: 1,
            orderStatus: 1,
            deliveryStatus: 1,
            createdAt: 1,
            updatedAt: 1,
            transactionRef: 1,
            paymentType: 1,
            address: 1,
            "user.name": 1,
            "user.email": 1,
            userId: 1
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: pageSize }
      ])
      .toArray();

    return NextResponse.json({
      orders,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });

  } catch (error) {
    console.error('[ADMIN_ORDERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 