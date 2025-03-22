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
          from: "wishlist",
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
          orderCount: { $ifNull: [{ $arrayElemAt: ["$orderCount.total", 0] }, 0] },
          lastActive: { 
            $cond: {
              if: "$lastActive",
              then: { $toString: "$lastActive" }, // Convert Date to ISO string
              else: null
            }
          }
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
    const sortField = sortBy === 'lastActive' ? 'lastActive' : sortBy;
    pipeline.push({
      $sort: {
        [sortField]: sortDirection === 'asc' ? 1 : -1
      }
    });

    // Add pagination
    const totalPipeline = [...pipeline];
    pipeline.push(
      { $skip: skip },
      { $limit: pageSize }
    );

    const [users, totalCount] = await Promise.all([
      db.collection('users').aggregate(pipeline).toArray(),
      db.collection('users').aggregate([...totalPipeline, { $count: 'total' }]).toArray()
    ]);

    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      users,
      page,
      pageSize,
      totalPages,
      total
    });
  } catch (error) {
    console.error('[USERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}