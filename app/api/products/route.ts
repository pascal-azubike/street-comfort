import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"
import { db } from "@/lib/db"

const ITEMS_PER_PAGE = 9

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" }, 
        { status: 401 }
      )
    }

    const body = await req.json()
    const client = await clientPromise
    const db = client.db()

    // Validate required fields
    if (!body.name || !body.price || !body.description || !body.category || !body.images?.length) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const product = await db.collection("products").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      message: "Product created successfully",
      product: {
        id: product.insertedId,
        ...body
      }
    }, { status: 201 })

  } catch (error) {
    console.error('[PRODUCTS_POST]', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortDirection = searchParams.get('sortDirection') || 'desc'
    
    const skip = (page - 1) * pageSize

    // Build the aggregation pipeline
    const pipeline: any[] = []

    if (search && search.trim() !== '') {
      pipeline.push({
        $search: {
          index: "products_search",
          compound: {
            should: [
              {
                text: {
                  query: search.trim(),
                  path: "title",
                  score: { boost: { value: 3 } }
                }
              },
              {
                text: {
                  query: search.trim(),
                  path: "description",
                  score: { boost: { value: 2 } }
                }
              },
              {
                text: {
                  query: search.trim(),
                  path: "category",
                  score: { boost: { value: 1 } }
                }
              }
            ]
          }
        }
      })

      pipeline.push({
        $addFields: {
          searchScore: { $meta: "searchScore" }
        }
      })
    }

    // Add a stage to convert string numbers to actual numbers for sorting
    pipeline.push({
      $addFields: {
        numericPrice: { $toDouble: "$price" },
        numericStock: { $toInt: "$stock" }
      }
    })

    if (category && category !== 'all') {
      pipeline.push({
        $match: { category: category }
      })
    }

    // Add lookup stages for cart and wishlist counts
    pipeline.push(
      // Lookup cart counts
      {
        $lookup: {
          from: "carts",
          let: { productId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $isArray: "$items" },
                    {
                      $gt: [
                        {
                          $reduce: {
                            input: "$items",
                            initialValue: 0,
                            in: {
                              $add: [
                                "$$value",
                                { $cond: [{ $eq: ["$$this._id", "$$productId"] }, 1, 0] }
                              ]
                            }
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          as: "cartCount"
        }
      },
      // Lookup wishlist counts
      {
        $lookup: {
          from: "wishlist",
          let: { productId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $isArray: "$items" },
                    {
                      $gt: [
                        {
                          $reduce: {
                            input: "$items",
                            initialValue: 0,
                            in: {
                              $add: [
                                "$$value",
                                { $cond: [{ $eq: ["$$this._id", "$$productId"] }, 1, 0] }
                              ]
                            }
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          as: "wishlistCount"
        }
      },
      // Lookup order counts
      {
        $lookup: {
          from: "orders",
          let: { productId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $isArray: "$items" },
                    {
                      $gt: [
                        {
                          $reduce: {
                            input: "$items",
                            initialValue: 0,
                            in: {
                              $add: [
                                "$$value",
                                { $cond: [{ $eq: ["$$this._id", "$$productId"] }, 1, 0] }
                              ]
                            }
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          as: "orderCount"
        }
      },
      // Add computed fields
      {
        $addFields: {
          cartCount: { $ifNull: [{ $arrayElemAt: ["$cartCount.count", 0] }, 0] },
          wishlistCount: { $ifNull: [{ $arrayElemAt: ["$wishlistCount.count", 0] }, 0] },
          orderCount: { $ifNull: [{ $arrayElemAt: ["$orderCount.count", 0] }, 0] }
        }
      }
    )

    // Update sorting to use numeric fields where appropriate
    const getSortField = (field: string) => {
      switch (field) {
        case 'price':
          return 'numericPrice'
        case 'stock':
          return 'numericStock'
        default:
          return field
      }
    }

    // Add sorting
    if (search && search.trim() !== '') {
      pipeline.push({ 
        $sort: { 
          searchScore: -1,
          [getSortField(sortBy)]: sortDirection === 'asc' ? 1 : -1
        } 
      })
    } else {
      pipeline.push({ 
        $sort: { 
          [getSortField(sortBy)]: sortDirection === 'asc' ? 1 : -1
        } 
      })
    }

    // Get total count
    const countPipeline = [...pipeline]
    countPipeline.push({ $count: "total" })

    // Add pagination
    pipeline.push(
      { $skip: skip },
      { $limit: pageSize }
    )

    // Remove the temporary numeric fields before sending response
    pipeline.push({
      $project: {
        numericPrice: 0,
        numericStock: 0
      }
    })

    const [products, totalResults] = await Promise.all([
      db.collection("products")
        .aggregate(pipeline)
        .toArray(),
      db.collection("products")
        .aggregate(countPipeline)
        .toArray()
    ])

    const total = totalResults[0]?.total || 0

    return NextResponse.json({
      products,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize
    })

  } catch (error) {
    console.error('[PRODUCTS_GET]', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    return new NextResponse("Internal error", { status: 500 })
  }
} 