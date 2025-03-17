'use client';

import { useState, use } from 'react';
import { PageHero } from '../../pageHero';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Minus,
  Plus,
  Share2,
  AlertCircle,
  HeartIcon,
  Share,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductImageCarousel } from '@/components/shop/product-image-carousel';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/store/use-cart';
import { useRouter } from 'next/navigation';
// Import the utility functions
import { useSession } from 'next-auth/react';
import { useWishlist } from '@/store/use-wishlist';
// import { generateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

interface Product {
  _id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  colors: string[];
  sizes: string[];
  details: { key: string; value: string }[];
  images: string[];
}

const formatNairaPrice = (price: string) => {
  const number = parseInt(price, 10);
  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(number);
};

async function fetchProduct(productId: string) {
  try {
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error('Failed to fetch product');
    }
    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
}

interface Props {
  params: { productId: string }
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   try {
//     const product = await fetchProduct(params.productId)
    
//     return generateMetadata({
//       title: product.name,
//       description: product.description,
//       image: product.images[0],
//       pathname: `/shop/${params.productId}`,
//     })
//   } catch (error) {
//     return generateMetadata({
//       title: 'Product Not Found',
//       description: 'The requested product could not be found.',
//       noIndex: true,
//       pathname: `/shop/${params.productId}`,
//     })
//   }
// }

export default function ProductDetail({
  params: paramsPromise,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const params = use(paramsPromise);
  const cart = useCart();
  const wishList = useWishlist();
  const router = useRouter();
  const { data: session } = useSession(); // Get session data

  const {
    data: product,
    error,
    status,
    isError,
    isLoading,
  } = useQuery<Product>({
    queryKey: ['product', params.productId],
    queryFn: () => fetchProduct(params.productId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const isInWishlist = product ? wishList.isInWishlist(product._id) : false; // Check if product is in wishlist

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product || !product._id) return;

    if (!session) {
      toast.error('Please login to add items to wishlist');
      router.push('/auth/signin');
      return;
    }

    if (isInWishlist) {
      await wishList.removeItem(product._id);
    } else {
      await wishList.addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.images[0],
        category: product.category,
      });
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!product) return;

    cart.addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      image: product.images[0],
      description: product.description,
      category: product.category,
      details: product.details,
      images: product.images
    });
  };

  const renderContent = () => {
    if (status === 'pending') {
      return (
        <div className="py-20">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#593C2D] mx-auto mb-4" />
              <p className="text-[#593C2D]/60">Loading product details...</p>
            </div>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="py-20">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-xl">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error Loading Product
              </h3>
              <p className="text-red-500 mb-4">
                {error instanceof Error
                  ? error.message
                  : 'Failed to load product details'}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (!product) {
      return (
        <div className="py-20">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="text-center max-w-md mx-auto p-6 bg-[#FDF7F5] rounded-xl">
              <AlertCircle className="h-8 w-8 text-[#593C2D] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#593C2D] mb-2">
                Product Not Found
              </h3>
              <p className="text-[#593C2D]/60 mb-4">
                The product you're looking for might have been removed or is no
                longer available.
              </p>
              <Button
                onClick={() => (window.location.href = '/shop')}
                className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
              >
                Back to Shop
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                <ProductImageCarousel images={product.images} />
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-['Playfair_Display'] text-[#593C2D] mb-2">
                    {product.name}
                  </h1>
                  <p className="text-2xl text-[#593C2D]/80 font-['Segoe_UI']">
                    ₦{formatNairaPrice(product.price)}
                  </p>
                </div>

                <div>
                  <p className="text-[#593C2D]/60 font-['Segoe_UI'] leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleAddToWishlist}
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    {wishList.isItemLoading(product._id) ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart
                        className={cn('h-5 w-5', {
                          'text-red-500 fill-red-500': isInWishlist,
                        })}
                      />
                    )}
                  </Button>
                </div>
                {/* Size Selection */}
                <div>
                  <h3 className="font-medium text-[#593C2D] mb-4 font-['Segoe_UI']">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "h-10 min-w-[2.5rem] px-3 rounded-lg border font-['Segoe_UI']",
                          selectedSize === size
                            ? 'border-[#593C2D] bg-[#593C2D] text-white'
                            : 'border-[#593C2D]/20 text-[#593C2D] hover:border-[#593C2D]'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <h3 className="font-medium text-[#593C2D] mb-4 font-['Segoe_UI']">
                    Quantity
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="p-2 rounded-lg border border-[#593C2D]/20 text-[#593C2D] hover:border-[#593C2D]"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-['Segoe_UI'] text-[#593C2D] min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        className="p-2 rounded-lg border border-[#593C2D]/20 text-[#593C2D] hover:border-[#593C2D]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-[#593C2D] hover:bg-[#593C2D]/90 text-white font-['Segoe_UI'] h-12 text-lg"
                >
                  Add to Cart
                </Button>

                {/* Product Details */}
                <div className="border-t border-[#593C2D]/10 pt-8">
                  <h3 className="font-medium text-[#593C2D] mb-4 font-['Segoe_UI']">
                    Product Details
                  </h3>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li
                        key={index}
                        className="text-[#593C2D]/60 font-['Segoe_UI'] text-sm"
                      >
                        <span className="font-medium text-[#593C2D]">
                          {detail.key}:
                        </span>{' '}
                        {detail.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div>
      <PageHero
        title={product?.name || 'Product Details'}
        description={product?.description || 'Loading product information...'}
      />
      {renderContent()}
    </div>
  );
}