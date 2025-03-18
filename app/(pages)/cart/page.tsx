'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PageHero } from '../pageHero';
import { useCart } from '@/store/use-cart';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { AlertTriangle, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { formatNairaPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import { OrderSummary } from '@/components/cart/order-summary';
import { AddressSelector } from '@/components/cart/address-selector';
import { useState, useMemo } from 'react';

export default function Cart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, removeItem, updateQuantity, processingItems = [] } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState<string>();

  // Calculate total only from available items
  const total = useMemo(() => {
    return items
      .filter(item => item.isAvailable)
      .reduce((acc, item) => acc + parseInt(item.price) * item.quantity, 0);
  }, [items]);

  if (items.length === 0) {
    return (
      <div>
        <PageHero
          title="Shopping Cart"
          description="View and manage your selected items."
        />
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-['Playfair_Display'] text-[#593C2D] mb-4">
              Your cart is empty
            </h2>
            <p className="text-[#593C2D]/60 mb-8">
              Add some beautiful pieces to your cart and start shopping!
            </p>
            <Link href="/shop">
              <Button className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title="Shopping Cart"
        description="View and manage your selected items."
      />

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => {
              const processingItem = (
                Array.isArray(processingItems) ? processingItems : []
              ).find(p => p?.id === item._id);
              const isProcessing = Boolean(processingItem);

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className={cn(
                    'relative flex gap-6 p-4 bg-white rounded-xl border',
                    !item.isAvailable ? 'border-red-300/50' : 'border-[#593C2D]/10',
                    isProcessing && 'opacity-60'
                  )}
                >
                  {/* Loading Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                      <div className="flex items-center gap-2 text-[#593C2D]">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">
                          {processingItem?.action === 'remove'
                            ? 'Removing item...'
                            : 'Updating quantity...'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className={cn(
                        "object-contain",
                        !item.isAvailable ? "opacity-60" : ""
                      )}
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-50 px-3 py-1 rounded-md">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <Link 
                        href={`/shop/${item._id}`}
                        className={cn(
                          "hover:text-[#593C2D]/80 transition-colors",
                          !item.isAvailable && "pointer-events-none"
                        )}
                      >
                        <h3 className="font-['Playfair_Display'] text-[#593C2D]">
                          {item.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeItem(item._id)}
                        className={cn(
                          "hover:text-red-600 disabled:opacity-50",
                          !item.isAvailable ? "text-red-500 bg-red-50 p-1 rounded" : "text-red-500"
                        )}
                        disabled={isProcessing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-sm text-[#593C2D]/60 mb-4">
                      Size: {item.size}
                    </p>

                    {!item.isAvailable ? (
                      <div className="text-sm text-red-600 mb-4">
                        This item is no longer available. Please remove it from your cart.
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1 rounded-lg border border-[#593C2D]/20 text-[#593C2D] hover:border-[#593C2D] disabled:opacity-50"
                            disabled={isProcessing || !item.isAvailable}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="p-1 rounded-lg border border-[#593C2D]/20 text-[#593C2D] hover:border-[#593C2D] disabled:opacity-50"
                            disabled={isProcessing || !item.isAvailable}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-medium text-[#593C2D]">
                          ₦{formatNairaPrice(item.price)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="relative">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-xl border border-[#593C2D]/10 p-6 h-fit space-y-6">
                {/* Show warning if there are unavailable items */}
                {items.some(item => !item.isAvailable) && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Some items are no longer available
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          Please remove unavailable items from your cart before proceeding with checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'authenticated' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#593C2D]">Delivery Address</h4>
                    <AddressSelector
                      selectedAddressId={selectedAddressId}
                      onAddressSelect={setSelectedAddressId}
                      returnUrl="/cart"
                    />
                  </div>
                )}

                <OrderSummary 
                  total={total} 
                  selectedAddressId={selectedAddressId}
                  hasUnavailableItems={items.some(item => !item.isAvailable)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
