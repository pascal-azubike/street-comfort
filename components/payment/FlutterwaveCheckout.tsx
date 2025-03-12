'use client';

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import type { FlutterWaveResponse } from 'flutterwave-react-v3/dist/types';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CartItem, FlutterwaveConfig } from '@/types/payment';
import { generateTransactionRef } from '@/lib/utils';

interface PaymentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  amount: number;
  items: any[];
  disabled?: boolean;
  addressId: string;
}

export function FlutterwaveCheckout({
  amount,
  items,
  disabled,
  addressId,
  children,
  className,
  ...props
}: PaymentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const email = session?.user?.email;
  const name = session?.user?.name || 'Guest User';
  const transactionRef = orderId
    ? generateTransactionRef(orderId)
    : generateTransactionRef();

  const createPendingOrder = async (transactionRef: string) => {
    try {
      // Transform items to include all product information
      const transformedItems = items.map(item => ({
        _id: item._id,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
        name: item.name,
        size: item.size,
        image: item.image,
        description: item.description,
        category: item.category,
        details: item.details || [],
        images: item.images
      }));

      const response = await fetch('/api/orders/pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          items: transformedItems,
          paymentStatus: 'pending',
          transactionRef,
          addressId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create pending order');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating pending order:', error);
      toast.error('Could not initialize payment. Please try again.');
      throw error;
    }
  };

  const config: FlutterwaveConfig = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: transactionRef,
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,ussd,banktransfer',
    customer: {
      email: email!,
      name: name,
      phone_number: '0000000000', // Default phone number since we don't collect it
    },
    customizations: {
      title: 'Street Comfort',
      description: 'Payment for your order',
      logo: 'https://streetcomfort.ng/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Create a pending order first
      const newOrderId = await createPendingOrder(transactionRef);
      setOrderId(newOrderId);

      // Initialize Flutterwave payment
      handleFlutterPayment({
        callback: (response: FlutterWaveResponse) => {
          closePaymentModal();
          
          // Redirect to order success page for verification
          router.push(
            `/order-success?orderId=${newOrderId}&transactionRef=${transactionRef}&status=pending`
          );
        },
        onClose: () => {
          toast.error('Payment closed');
          setIsLoading(false);
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Payment initialization error:', error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className={`w-full bg-[#593C2D] hover:bg-[#593C2D]/90 text-white ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children || 'Pay Now'
      )}
    </Button>
  );
}
