const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: {
    status: string;
    tx_ref: string;
    transaction_id: number;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    processor_response: string;
    auth_model: string;
    payment_type: string;
    created_at: string;
    card?: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      expiry: string;
    };
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
    };
  };
}

export type PaymentStatus = 'successful' | 'failed' | 'pending' | 'cancelled';

export async function verifyTransaction(
  transactionRef: string
): Promise<{ status: PaymentStatus; data: FlutterwaveResponse | null }> {
  try {
    const response = await fetch(
      `${FLUTTERWAVE_BASE_URL}/transactions/verify_by_reference?tx_ref=${transactionRef}`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data: FlutterwaveResponse = await response.json();
    console.log(data, response.status, 'verfiy flutterwave payment');
    if (!response.ok) {
      console.log('im inside response not ok ............. ');
      // Check if the error indicates no transaction found
      if (
        response.status === 404 ||
        data.message?.toLowerCase().includes('no transaction found')
      ) {
        return { status: 'cancelled', data: null };
      }
    }

    // If we have a response but no data, consider it cancelled
    if (!data.data) {
      console.log('im inside no data.data ..................');
      return { status: 'cancelled', data: null };
    }

    // Map Flutterwave status to our status
    const status = data.data.status?.toLowerCase();
    return {
      status:
        status === 'successful' || status === 'failed' || status === 'pending'
          ? (status as PaymentStatus)
          : 'failed',
      data,
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return { status: 'failed', data: null };
  }
}
