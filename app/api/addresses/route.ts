import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    console.log('GET inside .........................');
    try {
        const session = await auth();


        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log('Fetching addresses for user:', session.user.id); // Debug log

        // Get all addresses for the user
        console.log('session.user.id', session.user.id);
        const addresses = await db.collection("addresses")
            .find({ userId: new ObjectId(session.user.id) })
            .sort({ isDefault: -1, createdAt: -1 })
            .toArray();
        console.log('addresses', addresses, ".............................");


        return NextResponse.json(addresses);
    } catch (error) {
        console.error("[ADDRESSES_GET]", error);
        return new NextResponse(
            JSON.stringify({
                message: "Internal error",
                error: error instanceof Error ? error.message : String(error)
            }),
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            type,
            label,
            street,
            city,
            state,
            zipCode,
            landmark,
            instructions,
            isDefault,
        } = body;

        // If this is set as default, remove default from other addresses
        if (isDefault) {
            await db.collection("addresses").updateMany(
                { userId: new ObjectId(session.user.id) },
                { $set: { isDefault: false } }
            );
        }

        // Add new address
        const result = await db.collection("addresses").insertOne({
            userId: new ObjectId(session.user.id),
            type,
            label,
            street,
            city,
            state,
            zipCode,
            landmark,
            instructions,
            isDefault,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            addressId: result.insertedId,
            message: "Address added successfully"
        });
    } catch (error) {
        console.error("[ADDRESS_CREATE]", error);
        return new NextResponse(
            JSON.stringify({
                message: "Internal error",
                error: error instanceof Error ? error.message : String(error)
            }),
            { status: 500 }
        );
    }
} 