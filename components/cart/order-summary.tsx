import { Button } from "@/components/ui/button";
import { formatNairaPrice } from "@/lib/utils";
import { FlutterwaveCheckout } from "../payment/FlutterwaveCheckout";
import { ManualPaymentDialog } from "../payment/manual-payment-dialog";
import { useState } from "react";
import { useCart } from '@/store/use-cart';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface OrderSummaryProps {
  total: number;
  selectedAddressId?: string;
  hasUnavailableItems?: boolean;
}

export function OrderSummary({ 
  total, 
  selectedAddressId,
  hasUnavailableItems = false
}: OrderSummaryProps) {
  const { items } = useCart();
  const { status } = useSession();
  const [isManualPaymentOpen, setIsManualPaymentOpen] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  const isDisabled = status !== 'authenticated' || !selectedAddressId || hasUnavailableItems;

  const handleManualPayment = () => {
    // Generate a transaction reference
    const ref = `MAN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setTransactionRef(ref);
    setIsManualPaymentOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    // Format the order details for WhatsApp
    const orderDetails = items
      .filter(item => item.isAvailable !== false)
      .map(item => `${item.name} (${item.size}) x${item.quantity} - ₦${formatNairaPrice(item.price)}`
      ).join('\n');

    const message = `*New Order from Street Comfort*\n\n` +
      `*Order Details:*\n${orderDetails}\n\n` +
      `*Total Amount:* ₦${formatNairaPrice(total.toString())}\n\n` +
      `*Note:* This is a WhatsApp order request. Our team will contact you for confirmation and payment details.`;

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/2347035226775?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="lg:sticky lg:top-24 bg-[#FDF7F5] p-6 rounded-xl h-fit z-[50]">
      <h3 className="text-xl font-['Playfair_Display'] text-[#593C2D] mb-6">
        Order Summary
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-[#593C2D]">
          <span className="text-sm">Subtotal</span>
          <span className="text-sm font-medium">{formatNairaPrice(total.toString())}</span>
        </div>
        <div className="flex items-center justify-between text-[#593C2D]">
          <span className="text-sm">Delivery</span>
          <span className="text-sm font-medium">Free</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#593C2D]/10 pt-4 text-[#593C2D]">
          <span className="text-base font-medium">Total</span>
          <span className="text-base font-medium">{formatNairaPrice(total.toString())}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Temporarily disabled Flutterwave checkout */}
<div>
  {/* <FlutterwaveCheckout
          amount={total} 
          items={items.filter(item => item.isAvailable !== false)} 
          disabled={isDisabled}
          addressId={selectedAddressId || ''}
          className="w-full"
        >
          Pay Online
          {status !== 'authenticated' && " (Sign in required)"}
          {status === 'authenticated' && !selectedAddressId && " (Select address)"}
          {hasUnavailableItems && " (Remove unavailable items)"}
        </FlutterwaveCheckout> */}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleManualPayment}
          disabled={isDisabled}
        >
          Bank Transfer
          {status !== 'authenticated' && " (Sign in required)"}
          {status === 'authenticated' && !selectedAddressId && " (Select address)"}
          {hasUnavailableItems && " (Remove unavailable items)"}
        </Button>

        {isDisabled && status !== 'authenticated' && (
          <p className="mt-2 text-sm text-[#593C2D]/60 text-center">
            Please sign in to proceed with checkout
          </p>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FDF7F5] px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0 flex items-center justify-center gap-2 py-6" 
          onClick={handleWhatsAppCheckout} 
        > 
          <Image 
            src="/whatsapp.png" 
            alt="WhatsApp" 
            width={24} 
            height={24} 
            className="bg-white rounded-full p-1 shadow-sm" 
          />
          <span>Order via WhatsApp</span> 
        </Button>
      </div>

        {isDisabled && (
          <p className="mt-2 text-sm text-[#593C2D]/60 text-center">
            {status !== 'authenticated' 
              ? 'Please sign in to proceed with checkout'
              : !selectedAddressId
              ? 'Please select a delivery address to proceed'
              : hasUnavailableItems
              ? 'Please remove unavailable items from your cart to proceed'
              : null}
          </p>
        )}
      </div>
    

    {/* manual payment  */}

      <ManualPaymentDialog
        isOpen={isManualPaymentOpen}
        onClose={() => setIsManualPaymentOpen(false)}
        amount={total}
        transactionRef={transactionRef}
        items={items.filter(item => item.isAvailable !== false)}
        addressId={selectedAddressId || ""}
      />
    </div>
  );
}
