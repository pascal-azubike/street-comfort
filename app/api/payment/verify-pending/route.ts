import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyTransaction } from '@/lib/flutterwave';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const ordersCollection = db.collection('orders');

    // Get all pending orders that are not older than 24 hours
    const pendingOrders = await ordersCollection.find({
      paymentStatus: 'pending',
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    }).toArray();

    const results = [];

    for (const order of pendingOrders) {
      try {
        // Verify transaction status with Flutterwave
        const { status, data: flutterwaveResponse } = await verifyTransaction(order.transactionRef);
        console.log(status, flutterwaveResponse, "verfiy flutterwave payment pending route ..............");
        // Update order status based on verification result
        const updatedOrder = await ordersCollection.updateOne(
          { _id: new ObjectId(order._id) },
          {
            $set: {
              paymentStatus: status.toLowerCase(),
              updatedAt: new Date(),
              paymentData: {
                ...(order.paymentData || {}),
                verificationResult: status,
                verifiedAt: new Date().toISOString(),
                flutterwaveResponse: flutterwaveResponse || { error: 'No transaction found' },
                processorResponse: flutterwaveResponse?.data?.processor_response || null,
                lastVerificationAttempt: new Date().toISOString(),
                cancellationReason: status === 'cancelled' ? 'Transaction not initiated with Flutterwave' : undefined
              }
            }
          }
        );

        results.push({
          orderId: order._id.toString(),
          transactionRef: order.transactionRef,
          previousStatus: order.paymentStatus,
          newStatus: status,
          processorResponse: flutterwaveResponse?.data?.processor_response || null,
          cancelled: status === 'cancelled',
          success: true
        });
      } catch (error) {
        console.error(`Error verifying order ${order._id}:`, error);
        
        // Update order with error information
        await ordersCollection.updateOne(
          { _id: new ObjectId(order._id) },
          {
            $set: {
              paymentData: {
                ...(order.paymentData || {}),
                lastVerificationError: String(error),
                lastVerificationAttempt: new Date().toISOString()
              }
            }
          }
        );

        results.push({
          orderId: order._id.toString(),
          transactionRef: order.transactionRef,
          error: String(error),
          success: false
        });
      }
    }

    return NextResponse.json({
      success: true,
      verifiedCount: results.length,
      results
    });
  } catch (error) {
    console.error('Error verifying pending transactions:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
