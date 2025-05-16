'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Trash, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/store/use-wishlist';
import { useCart } from '@/store/use-cart';
import { useSession } from 'next-auth/react';
import { PageHero } from '@/app/(pages)/pageHero';
import { cn } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeItem, fetchItems, isItemLoading } = useWishlist();
  const { addItem } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      await fetchItems();
      setLoading(false);
    };
    fetchWishlist();
  }, [fetchItems]);

  if (!session) {
    return (
      <>
      <PageHero title="My Wishlist" description="View and manage your wishlist items." />
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-[#B68C66]" />
        <h3 className="mt-4 text-xl font-['Playfair_Display'] text-[#593C2D]">
          Please login to view your wishlist
        </h3>
        <Button
          className="mt-6 bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
          onClick={() => router.push('/auth/signin')}
        >
          Login
        </Button>
      </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
      <PageHero title="My Wishlist" description="View and manage your wishlist items." />
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-12 w-12 text-[#B68C66] animate-spin transition" />
        <h3 className="mt-4 text-xl font-['Playfair_Display'] text-[#593C2D]">
          Loading your wishlist...
        </h3>
      </div>
      </>
    );
  }

  if (!items?.length) {
    return (
      <>
      <PageHero title="My Wishlist" description="View and manage your wishlist items." />
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-[#B68C66]" />
        <h3 className="mt-4 text-xl font-['Playfair_Display'] text-[#593C2D]">
          Your wishlist is empty
        </h3>
        <p className="mt-2 text-[#593C2D]/60">
          Add your favorite pieces to your wishlist
        </p>
        <Button
          className="mt-6 bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
          onClick={() => router.push('/shop')}
        >
          Browse Collection
        </Button>
      </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="My Wishlist"
        description="View and manage your wishlist items."
      />

      <div className="container mx-auto py-8 px-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-[#593C2D] mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const isLoading = isItemLoading(item._id);
            return (
              <div
                key={item._id}
                className={cn(
                  'bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300',
                  isLoading ? 'opacity-50 pointer-events-none' : '',
                  item.isAvailable === false ? 'border-red-300/50' : 'border-[#593C2D]/10'
                )}
              >
                <Link href={`/shop/${item._id}`}>
                  <div className="relative h-[300px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-contain p-4 ${item.isAvailable === false ? 'opacity-60' : ''}`}
                    />
                    {item.isAvailable === false && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-50 px-4 py-2 rounded-md">
                          <p className="text-red-600 text-sm font-semibold">No Longer Available</p>
                        </div>
                      </div>
                    )}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                        <Loader2 className="h-8 w-8 text-[#B68C66] animate-spin" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-sm font-['Playfair_Display'] text-[#593C2D]/60">
                    {item.category}
                  </p>

                  <Link href={`/shop/${item._id}`}>
                    <h3 className="text-[#593C2D] font-['Segoe_UI'] mb-2">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    <span className="text-[#593C2D]/80 font-['Segoe_UI']">
                      ₦{item.price}
                    </span>
                    <div className="flex gap-2">
                      {item.isAvailable === false ? (
                        <Button
                          disabled
                          variant="default"
                          size="sm"
                          className="bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            addItem({
                              _id: item._id,
                              name: item.name,
                              price: item.price,
                              quantity: 1,
                              size: item.size,
                              image: item.image,
                              description: 'wishlist description',
                              category: item.category,
                              details: [],
                              images: [item.image],
                            });
                            toast.success('Item added to cart');
                          }}
                          variant="default"
                          size="sm"
                          className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
                          disabled={isLoading}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => removeItem(item._id)}
                        variant={item.isAvailable === false ? "destructive" : "outline"}
                        size="sm"
                        className={item.isAvailable === false ? "" : "border-[#593C2D]/20 hover:bg-[#593C2D]/5"}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className={`h-4 w-4 ${item.isAvailable === false ? "text-white" : "text-[#593C2D]"}`} />
                        )}
                      </Button>
                    </div>
                  </div>
                  {item.isAvailable === false && (
                    <p className="mt-2 text-sm text-red-600">
                      This item is no longer available. You may remove it from your wishlist.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}