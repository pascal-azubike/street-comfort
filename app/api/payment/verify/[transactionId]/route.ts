import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactionId = request.nextUrl.pathname.split('/').pop();
    
    if (!transactionId) {
      return new NextResponse("Transaction ID is required", { status: 400 });
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('FLUTTERWAVE_SECRET_KEY is not configured');
    }

    // Call Flutterwave's verification endpoint
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify transaction with Flutterwave');
    }

    const data = await response.json();
    console.log('Payment verification response:', data);

    // Check if the transaction is still processing
    if (data.data.status === "pending") {
      return NextResponse.json({
        status: "pending",
        data: data.data,
        message: "Transaction is still processing"
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment verification error:', error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Verification failed", 
        error: error instanceof Error ? error.message : String(error) 
      }), 
      { status: 500 }
    );
  }
} 