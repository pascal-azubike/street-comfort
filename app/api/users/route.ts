import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    
    const skip = (page - 1) * pageSize;

    // Build the aggregation pipeline
    const pipeline: any[] = [];

    if (search && search.trim() !== '') {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search.trim(), $options: 'i' } },
            { email: { $regex: search.trim(), $options: 'i' } },
          ]
        }
      });
    }

    // Add lookups for counts
    pipeline.push(
      // Cart count
      {
        $lookup: {
          from: "carts",
          localField: "_id",
          foreignField: "userId",
          pipeline: [{ $limit: 1 }],
          as: "cart"
        }
      },
      // Wishlist count
      {
        $lookup: {
          from: "wishlists",
          localField: "_id",
          foreignField: "userId",
          pipeline: [{ $limit: 1 }],
          as: "wishlist"
        }
      },
      // Update Order count to only count successful payments
      {
        $lookup: {
          from: "orders",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
                paymentStatus: "successful" // Only count successful payments
              }
            },
            { $count: "total" }
          ],
          as: "orderCount"
        }
      },
      // Add computed fields
      {
        $addFields: {
          cartCount: {
            $cond: {
              if: { $gt: [{ $size: "$cart" }, 0] },
              then: { $size: { $ifNull: [{ $arrayElemAt: ["$cart.items", 0] }, []] } },
              else: 0
            }
          },
          wishlistCount: {
            $cond: {
              if: { $gt: [{ $size: "$wishlist" }, 0] },
              then: { $size: { $ifNull: [{ $arrayElemAt: ["$wishlist.items", 0] }, []] } },
              else: 0
            }
          },
          orderCount: { $ifNull: [{ $arrayElemAt: ["$orderCount.total", 0] }, 0] }
        }
      },
      // Remove unnecessary fields
      {
        $project: {
          password: 0,
          cart: 0,
          wishlist: 0,
        }
      }
    );

    // Add sorting
    pipeline.push({
      $sort: {
        [sortBy]: sortDirection === 'asc' ? 1 : -1
      }
    });

    // Get total count
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });

    // Add pagination
    pipeline.push(
      { $skip: skip },
      { $limit: pageSize }
    );

    const [users, totalResults] = await Promise.all([
      db.collection("users")
        .aggregate(pipeline)
        .toArray(),
      db.collection("users")
        .aggregate(countPipeline)
        .toArray()
    ]);

    const total = totalResults[0]?.total || 0;

    return NextResponse.json({
      users,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize
    });

  } catch (error) {
    console.error('[USERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 