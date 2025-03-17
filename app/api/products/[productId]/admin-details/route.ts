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

    // Convert product ID to string to match with cart/wishlist/order items
    const productIdString = product._id.toString();

    // Get cart details - using items array with _id match
    const cartDetails = await db.collection("carts").aggregate([
      {
        $match: {
          "items._id": productIdString
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
        $addFields: {
          matchedItem: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item._id", productIdString] }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$userId" },
          quantity: { $arrayElemAt: ["$matchedItem.quantity", 0] },
          size: { $arrayElemAt: ["$matchedItem.size", 0] },
          updatedAt: 1,
          name: { $arrayElemAt: ["$user.name", 0] },
          email: { $arrayElemAt: ["$user.email", 0] },
          image: { $arrayElemAt: ["$user.image", 0] }
        }
      }
    ]).toArray();

    // Get wishlist details - using items array with _id match
    const wishlistDetails = await db.collection("wishlist").aggregate([
      {
        $match: {
          "items._id": productIdString
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
        $addFields: {
          matchedItem: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item._id", productIdString] }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$userId" },
          addedAt: { $arrayElemAt: ["$matchedItem.addedAt", 0] },
          size: { $arrayElemAt: ["$matchedItem.size", 0] },
          // User details
          name: { $arrayElemAt: ["$user.name", 0] },
          email: { $arrayElemAt: ["$user.email", 0] },
          image: { $arrayElemAt: ["$user.image", 0] },
          // Product details from wishlist item
          productName: { $arrayElemAt: ["$matchedItem.name", 0] },
          productImage: { $arrayElemAt: ["$matchedItem.image", 0] },
          productPrice: { $arrayElemAt: ["$matchedItem.price", 0] },
          productCategory: { $arrayElemAt: ["$matchedItem.category", 0] },
          isAvailable: { $arrayElemAt: ["$matchedItem.isAvailable", 0] }
        }
      }
    ]).toArray();

    // Get order details - using orderItems array with productId match
    const orderDetails = await db.collection("orders").aggregate([
      {
        $match: {
          "orderItems": {
            $elemMatch: {
              productId: productIdString,
              orderStatus: { $ne: "cancelled" }
            }
          }
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
        $addFields: {
          matchedItem: {
            $filter: {
              input: "$orderItems",
              as: "item",
              cond: { $eq: ["$$item.productId", productIdString] }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$userId" },
          orderId: { $toString: "$_id" },
          quantity: { $arrayElemAt: ["$matchedItem.quantity", 0] },
          price: { $arrayElemAt: ["$matchedItem.price", 0] },
          amount: { $arrayElemAt: ["$matchedItem.amount", 0] },
          transactionRef: { $arrayElemAt: ["$matchedItem.transactionRef", 0] },
          orderStatus: { $arrayElemAt: ["$matchedItem.orderStatus", 0] },
          paymentStatus: { $arrayElemAt: ["$matchedItem.paymentStatus", 0] },
          deliveryStatus: { $arrayElemAt: ["$matchedItem.deliveryStatus", 0] },
          orderDate: "$createdAt",
          updatedAt: "$updatedAt",
          name: { $arrayElemAt: ["$user.name", 0] },
          email: { $arrayElemAt: ["$user.email", 0] },
          image: { $arrayElemAt: ["$user.image", 0] },
          deliveryDetails: {
            isDelivered: "$deliveryDetails.isDelivered",
            deliveredAt: "$deliveryDetails.deliveredAt",
            estimatedDeliveryDate: "$deliveryDetails.estimatedDeliveryDate",
            trackingNumber: "$deliveryDetails.trackingNumber"
          },
          paymentData: {
            verificationResult: "$paymentData.verificationResult",
            verifiedAt: "$paymentData.verifiedAt",
            cancellationReason: "$paymentData.cancellationReason",
            cancelledAt: "$paymentData.cancelledAt"
          },
          attempts: "$attempts"
        }
      }
    ]).toArray();

    // Log detailed debugging information
    console.log('[PRODUCT_ADMIN_DETAILS]', {
      productId: productIdString,
      counts: {
        cart: cartDetails.length,
        wishlist: wishlistDetails.length,
        orders: orderDetails.length
      },
      sample: {
        cart: cartDetails[0],
        wishlist: wishlistDetails[0],
        order: orderDetails[0]
      }
    });

    // Format response
    const response = {
      product: {
        ...product,
        _id: productIdString
      },
      cartDetails: {
        count: cartDetails.length,
        users: cartDetails
      },
      wishlistDetails: {
        count: wishlistDetails.length,
        users: wishlistDetails
      },
      orderDetails: {
        count: orderDetails.length,
        users: orderDetails
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[PRODUCT_ADMIN_DETAILS]', error);
    return NextResponse.json(
      { error: "Failed to fetch product admin details" },
      { status: 500 }
    );
  }
}
