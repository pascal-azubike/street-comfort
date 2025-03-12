import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.pathname.split('/')[3]; // /api/products/[productId]/admin-details
  
  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify admin role
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    });

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized - Admin access required", { status: 401 });
    }

    // Get product details
    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get cart details
    const cartDetails = await db.collection("carts").aggregate([
      {
        $match: {
          "items._id": productId
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          "user.name": 1,
          "user.image": 1,
          quantity: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item._id", productId] }
            }
          }
        }
      },
      {
        $unwind: "$quantity"
      }
    ]).toArray();
    console.log(cartDetails, "......................cartDetails");

    // Get wishlist details
    const wishlistDetails = await db.collection("wishlists").aggregate([
      {
        $match: {
          "items._id": productId
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]).toArray();

    // Get additional admin-specific details here
    // For example: inventory levels, sales data, etc.
    const adminDetails = {
      ...product,
      // Add any additional admin-specific fields
      _id: product._id.toString(),
      // sales: await getSalesData(productId),
      // inventory: await getInventoryData(productId),
      cartDetails: {
        count: cartDetails.length,
        users: cartDetails.map(item => ({
          id: item.user._id,
          name: item.user.name,
          image: item.user.image,
          quantity: item.quantity.quantity
        })),
      },
      wishlistDetails: {
        count: wishlistDetails.length,
        users: wishlistDetails.map(item => ({
          id: item.user._id,
          name: item.user.name,
          image: item.user.image,
          addedAt: item.updatedAt
        })),
      }
    };

    return NextResponse.json(adminDetails);

  } catch (error) {
    console.error('[PRODUCT_ADMIN_DETAILS]', error);
    return NextResponse.json(
      { error: "Failed to fetch product admin details" }, 
      { status: 500 }
    );
  }
} 