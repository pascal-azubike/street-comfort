import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Your MongoDB connection utility
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { wishlist } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    // Update the wishlist in the database
    await db.collection('wishlists').updateOne(
      { userId: new ObjectId(session.user.id) },
      { $set: { items: wishlist } },
      { upsert: true }
    );

    return NextResponse.json(
      { message: 'Wishlist synced with database' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[WISHLIST_SYNC]', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 