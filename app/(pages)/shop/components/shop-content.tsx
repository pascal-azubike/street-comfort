'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { PageHero } from '../../pageHero';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LogoCloud from '@/app/(home)/sections/LogoCloud';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Heart, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ShopFilters } from '@/components/shop/shop-filters';
import Reviews from '@/app/(home)/sections/Reviews';
import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useCart } from '@/store/use-cart';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usewishList } from '@/store/use-wishlist';
import { Metadata } from 'next'
import { generateMetadata } from '@/app/lib/metadata';
import { FloatingNav } from '@/components/ui/floating-navbar';


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

async function fetchProducts({ 
  page = 1, 
  category = undefined, 
  sort = 'createdAt-desc',
  sizes = [] 
}: {
  page?: number;
  category?: string[];
  sort?: string;
  sizes?: string[];
}) {
  try {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    
    if (category?.length && !category.includes('all')) {
      params.append('category', category.join(','));
    }
    
    if (sort && sort !== 'createdAt-desc') {
      params.append('sort', sort);
    }
    
    if (sizes?.length) {
      params.append('sizes', sizes.map(s => s.toUpperCase()).join(','));
    }

    const res = await fetch(`/api/products/allProduct?${params}`);
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}



export default function ShopComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const cart = useCart();
  const { data: session } = useSession();
  const wishList = usewishList();

  // Get initial values from URL
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || ['all']
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    searchParams.get('sort') || 'createdAt-desc'
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.get('sizes')?.split(',').filter(Boolean) || []
  );

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      // Normalize the category from URL
      const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
      handleApplyFilters({
        category: [normalizedCategory],
        sort: 'createdAt-desc',
        sizes: []
      });
    }
  }, [searchParams]);

  // Query products
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products', selectedCategory, selectedSort, selectedSizes],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchProducts({
        page: pageParam,
        category: selectedCategory.includes('all') ? undefined : selectedCategory,
        sort: selectedSort,
        sizes: selectedSizes,
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
  });

  // Update URL when filters change
  const updateUrl = (params: { 
    category?: string[], 
    sort?: string, 
    sizes?: string[] 
  }) => {
    const current = new URLSearchParams(searchParams.toString());
    
    if (params.category?.length && !params.category.includes('all')) {
      current.set('category', params.category.join(','));
    } else {
      current.delete('category');
    }

    if (params.sort && params.sort !== 'createdAt-desc') {
      current.set('sort', params.sort);
    } else {
      current.delete('sort');
    }

    if (params.sizes?.length) {
      current.set('sizes', params.sizes.join(','));
    } else {
      current.delete('sizes');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/shop${query}`, { scroll: false });
  };

  // Handle filter application
  const handleApplyFilters = (newFilters: {
    category: string[];
    sort: string;
    sizes: string[];
  }) => {
    // Normalize categories: replace spaces with hyphens and handle special cases
    const normalizedCategories = newFilters.category.map(cat => {
      // Special case for "complete sets"
      if (cat.toLowerCase() === 'complete sets') {
        return 'complete-sets';
      }
      return cat.toLowerCase().replace(/\s+/g, '-');
    });
    
    setSelectedCategory(normalizedCategories);
    setSelectedSort(newFilters.sort);
    setSelectedSizes(newFilters.sizes);
    updateUrl({ ...newFilters, category: normalizedCategories });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Handle filter reset
  const handleResetFilters = () => {
    const defaultFilters = {
      category: ['all'],
      sort: 'createdAt-desc',
      sizes: []
    };
    setSelectedCategory(defaultFilters.category);
    setSelectedSort(defaultFilters.sort);
    setSelectedSizes(defaultFilters.sizes);
    updateUrl(defaultFilters);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Prevent event bubbling

    if (!product.sizes || product.sizes.length === 0) {
      toast.error('Product has no available sizes');
      return;
    }

    cart.addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1, // Fixed: Always use 1 for quick add
      size: product.sizes[0], // Fixed: Use first available size
      image: product.images[0],
      description: product.description,
      category: product.category,
      details: product.details || [], // Handle case where details might be undefined
      images: product.images,
    });

    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`,
      action: {
        label: 'View Cart',
        onClick: () => (window.location.href = '/cart'),
      },
    });
  };

  // Update the handleWishlistClick function
  const handleWishlistClick = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please login to add items to wishlist');
      router.push('/auth/signin');
      return;
    }

    const isInWishlist = wishList.isInWishlist(product._id);

    if (isInWishlist) {
      await wishList.removeItem(product._id);
      toast.success('Removed from wishlist');
    } else {
      await wishList.addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        size: product.sizes[0], // Using first available size as default
        image: product.images[0],
        category: product.category,
      });
      toast.success('Added to wishlist');
    }
  };

  // Add useEffect to initialize wishlist
  useEffect(() => {
    if (session?.user) {
      wishList.initializeWishlist();
    }
  }, [session?.user]);

  return (
    <div>
      <PageHero
        title="Nigerian Fashion Store | Shop Quality Clothing"
        description="Affordable Nigerian streetwear, t-shirts, hoodies & complete sets. Quality guaranteed with nationwide delivery."
      />
      <LogoCloud />
      <section className="py-20 max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          {/* Collection Header */}
          <div className="mb-12">
            <div className="flex max-w-5xl mx-auto mb-16 flex-col justify-between items-start md:items-center gap-8">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] text-[#593C2D]">
                Quality Fashion
                <br />
                Made Affordable
              </h2>
              <p className="text-[#593C2D]/60 max-w-md text-sm leading-relaxed">
                Premium Nigerian streetwear for everyday style. Fast shipping, great prices, sizes XS-XL.
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className="hidden md:block w-64">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-[#593C2D]/10 p-6 space-y-8 sticky top-8">
                <ShopFilters 
                  variant="sidebar"
                  selectedCategory={selectedCategory}
                  selectedSort={selectedSort}
                  selectedSizes={selectedSizes}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {status === 'pending' ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#593C2D]" />
                </div>
              ) : status === 'error' ? (
                <div className="text-center text-red-500">
                  Error: {error.message}
                </div>
              ) : data?.pages[0]?.items?.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-[#593C2D]/60 text-lg">No products found matching your filters.</p>
                  <Button 
                    onClick={handleResetFilters}
                    className="mt-4 bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : data ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.pages.map((page, i) => {
                      return (
                        <React.Fragment key={i}>
                          {page.items?.map((product: Product) => (
                            <Link
                              key={product._id}
                              href={`/shop/${product._id}`}
                              className="group relative"
                            >
                              <div className="bg-white rounded-lg overflow-hidden border border-[#593C2D]/10 hover:shadow-lg transition-all duration-300 group relative">
                                {/* Product Image with Wishlist Icon */}
                                <div className="relative w-full h-[400px] overflow-hidden">
                                  <Image
                                    src={
                                      product.images?.[0] ||
                                      '/product-placeholder.jpg'
                                    }
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:brightness-[1.02] group-hover:rotate-1"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    placeholder="blur"
                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                      shimmer(700, 475)
                                    )}`}
                                  />
                                  {/* Wishlist Icon */}
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleWishlistClick(e, product);
                                    }}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm 
                                               md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300
                                               hover:bg-white text-[#593C2D]/60 hover:text-[#593C2D] z-20"
                                  >
                                    <Heart 
                                      className={cn(
                                        "h-6 w-6",
                                        wishList.isInWishlist(product._id) && "fill-current text-red-500"
                                      )}
                                    />
                                  </button>
                                  {/* Add to Bag Button */}
                                  <div className="absolute inset-0 flex items-end justify-center 
                                                    md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 
                                                    bg-gradient-to-t from-black/10 to-transparent z-10">
                                    <Button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddToCart(e, product);
                                      }}
                                      className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white font-['Segoe_UI'] mb-6"
                                    >
                                      Add to Bag
                                    </Button>
                                  </div>
                                </div>

                                <div className="p-4">
                                  {/* Remove the old wishlist button location */}
                                  <p className="text-sm font-['Playfair_Display'] text-[#593C2D]/60 mb-1">
                                    {product.category}
                                  </p>

                                  {/* Product Name */}
                                  <h3 className="text-sm font-['Segoe_UI'] text-[#593C2D] mb-2">
                                    {product.name}
                                  </h3>

                                  {/* Price */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-['Segoe_UI'] text-[#593C2D]/80">
                                      ₦{formatNairaPrice(product.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Loading indicator for next page */}
                  {isFetchingNextPage && (
                    <div className="flex justify-center mt-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#593C2D]" />
                    </div>
                  )}

                  {/* Intersection observer target */}
                  <div ref={ref} className="h-10" />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <FloatingNav 
        onApplyFilters={(filters) => {
          handleApplyFilters({
            category: filters.category,
            sort: filters.sort,
            sizes: filters.sizes
          });
        }}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}

// Image blur placeholder helpers
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3e6dc" offset="20%" />
      <stop stop-color="#fdf7f5" offset="50%" />
      <stop stop-color="#f3e6dc" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3e6dc" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
