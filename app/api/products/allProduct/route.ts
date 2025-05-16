import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const sort = searchParams.get("sort") || "createdAt-desc"
    const sizes = searchParams.get("sizes")?.split(",")
      .filter(Boolean)
      .map(size => size.toUpperCase()) || []

    const client = await clientPromise
    const db = client.db()

    // Build query based on filters
    const query: Record<string, any> = {};

    // Add category filter
    if (category) {
      const categories = category.split(',').filter(Boolean);
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Add size filter with case-insensitive matching
    if (sizes.length > 0) {
      query.sizes = {
        $in: sizes.map(size => new RegExp(`^${size}$`, 'i'))
      };
    }

    // Define sort options
    const getSortOptions = (sortOption: string): Record<string, 1 | -1> => {
      switch (sortOption) {
        case 'createdAt-desc':
          return { createdAt: -1 };
        case 'price-asc':
          return { numericPrice: 1 };
        case 'price-desc':
          return { numericPrice: -1 };
        case 'name-asc':
          return { name: 1 };
        case 'name-desc':
          return { name: -1 };
        default:
          return { createdAt: -1 };
      }
    };

    const sortOptions = getSortOptions(sort);

    // First, add a stage to convert price strings to numbers
    const pipeline = [
      // Match stage (your filters)
      { $match: query },
      // Add numeric price field
      {
        $addFields: {
          numericPrice: { $toDouble: "$price" }
        }
      },
      // Sort stage
      { $sort: sortOptions },
      // Skip and limit for pagination
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE + 1 }
    ];

    console.log('Query with sizes:', query); // Debug log

    // Execute the pipeline
    const products = await db.collection("products")
      .aggregate(pipeline)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection("products")
      .countDocuments(query);

    const hasNextPage = products.length > ITEMS_PER_PAGE;
    const items = hasNextPage ? products.slice(0, -1) : products;

    const response = {
      items: items.map(product => ({
        ...product,
        _id: product._id.toString(),
        images: product.images || [],
      })),
      hasNextPage,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
      currentPage: page,
    };

    console.log('Query:', query);
    console.log('Sort:', sortOptions);
    console.log('Found products:', products.length);
    console.log('Response:', {
      itemsCount: response.items.length,
      hasNextPage: response.hasNextPage,
      totalPages: response.totalPages,
      currentPage: response.currentPage
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 