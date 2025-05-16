import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Vercel Cron Job handler that runs every 5 minutes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Verify cron secret to ensure request is from Vercel
    const headersList = await headers();
    const cronSecret = headersList.get('x-cron-secret');

    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get host from request headers
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/payment/verify-pending`);
    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Cron job completed successfully',
      results: data
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
