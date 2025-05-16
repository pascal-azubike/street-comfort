'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/store/use-cart';

interface PaymentDetails {
  paymentReference: string;
  amount: number;
  paymentMethod: string;
  customerEmail: string;
  processorResponse?: string;
  cardDetails?: {
    last4: string;
    issuer: string;
    type: string;
  };
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>(
    searchParams?.get('status') || 'pending'
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isVerifying, setIsVerifying] = useState(true);

  const orderId = searchParams.get('orderId');
  const transactionRef = searchParams.get('transactionRef');
  const cart = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !transactionRef) {
        console.log('Missing orderId or transactionRef in URL');
        setStatus('failed');
        setIsVerifying(false);
        return;
      }

      console.log('Verifying payment for transaction:', transactionRef);

      const maxRetries = 3;
      const retryDelay = 2000;
      let retries = 0;

      while (retries < maxRetries) {
        try {
          const response = await fetch(
            `/api/payment/verify-by-reference/${transactionRef}?orderId=${orderId}`
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Verification request failed');
          }

          if (
            data.status === 'successful' ||
            data.status === 'failed' ||
            data.status === 'cancelled'
          ) {
            setStatus(data.status);
            setPaymentDetails(data.paymentDetails);
            setIsVerifying(false);
            cart.clearCart();
            return;
          }

          // If still pending, wait and retry
          retries++;
          if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          retries++;
          if (retries === maxRetries) {
            setStatus('failed');
            setIsVerifying(false);
            toast.error(
              'Payment verification failed. Please contact support if payment was deducted.'
            );
            return;
          }
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }

      setStatus('failed');
      setIsVerifying(false);
      toast.error(
        'Payment verification timed out. Please contact support if payment was deducted.'
      );
    };

    verifyPayment();
  }, [orderId, transactionRef]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-lg">Verifying your payment...</p>
      </div>
    );
  }

  if (status === 'success' || status === 'successful') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
        {paymentDetails && (
          <div className="text-center space-y-2">
            <p>Amount: ₦{paymentDetails.amount?.toLocaleString()}</p>
            <p>Reference: {paymentDetails.paymentReference}</p>
            <p>Payment Method: {paymentDetails.paymentMethod}</p>
            {paymentDetails.cardDetails && (
              <p>
                Card: {paymentDetails.cardDetails.issuer} ****
                {paymentDetails.cardDetails.last4}
              </p>
            )}
          </div>
        )}
        <div className="space-y-4">
          <Link href="/orders">
            <Button>View Order</Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-4">
        <AlertCircle className="w-16 h-16 text-yellow-500" />
        <h1 className="text-2xl font-bold text-center">Payment Cancelled</h1>
        <p className="text-center text-gray-600">
          The payment was not initiated or was cancelled.
        </p>
        <div className="space-y-4">
          <Link href="/checkout">
            <Button>Try Again</Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-4">
      <XCircle className="w-16 h-16 text-red-500" />
      <h1 className="text-2xl font-bold text-center">Payment Failed</h1>
      {paymentDetails?.processorResponse && (
        <p className="text-center text-red-600">
          Reason: {paymentDetails.processorResponse}
        </p>
      )}
      <div className="space-y-4">
        <Link href="/checkout">
          <Button>Try Again</Button>
        </Link>
        <Link href="/" className="block">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
