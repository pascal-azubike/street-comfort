'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Heart, Trash, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usewishList } from '@/store/use-wishlist';
import { useCart } from '@/store/use-cart';

import { useSession } from 'next-auth/react';
import { PageHero } from '@/app/(pages)/pageHero';

export default function WishlistPage() {
  const { items, removeItem, fetchItems } = usewishList();
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

  if (!items.length) {
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
          {items.map(item => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-[#593C2D]/10 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/shop/${item._id}`}>
                <div className="relative h-[300px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-4"
                  />
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
                          details:  [],
                          images:  [item.image],
                        });
                        toast.success('Item added to cart');
                      }}
                      variant="default"
                      size="sm"
                      className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        removeItem(item._id);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-[#593C2D]/20 hover:bg-[#593C2D]/5"
                    >
                      <Trash className="h-4 w-4 text-[#593C2D]" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
