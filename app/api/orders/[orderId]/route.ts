import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.pathname.split('/').pop();
  
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderId)
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        _id: order._id.toString()
      }
    });
  } catch (error:any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const orderId = request.nextUrl.pathname.split('/').pop();
  
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    // Your order update logic here
    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const orderId = request.nextUrl.pathname.split('/').pop();
  
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    // Your order deletion logic here
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
