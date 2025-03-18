"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/app/(pages)/pageHero";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Image as ImageIcon,
  Info,
  Edit,
  Calendar,
  Package,
  Tag,
  ShoppingBag,
  Eye
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNairaPrice } from "@/lib/utils";
import Link from "next/link";

export default function ViewProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const { data: productDetails, isLoading, isError } = useQuery({
    queryKey: ['product-details', productId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/products/${productId}/admin-details`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch product details');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <>
        <PageHero
          title="Loading Product..."
          description="Fetching product information and statistics."
        />
        <LoadingSkeleton />
      </>
    );
  }

  if (isError || !productDetails?.product) {
    return (
      <>
        <PageHero
          title="Error"
          description="Unable to load product details."
        />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Failed to load product details</h2>
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </>
    );
  }

  const { 
    product, 
    cartDetails = { count: 0, users: [] }, 
    wishlistDetails = { count: 0, users: [] },
    orderDetails = { count: 0, users: [] }
  } = productDetails;

  return (
    <>
      <PageHero
        title={product.name || "Product Details"}
        description="Comprehensive view of product information and statistics."
      />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <Button 
            onClick={() => router.push(`/products/create?id=${productId}`)}
            className="w-full sm:w-auto"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Gallery
              </CardTitle>
              <CardDescription>
                {product.images?.length || 0} images available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images?.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden border group"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}/{product.images.length}
                    </div>
                  </div>
                ))}
                {(!product.images || product.images.length === 0) && (
                  <div className="aspect-square relative rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-xl line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <p className="text-2xl font-bold text-primary mt-3">
                  {formatNairaPrice(product.price)}
                </p>
                {product.description && (
                  <p className="mt-4 text-muted-foreground">{product.description}</p>
                )}
              </div>

              {product.details && product.details.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Product Details</p>
                  <div className="space-y-2">
                    {product.details.map((detail:any, index:any) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-sm font-medium">{detail.key}:</span>
                        <span className="text-sm text-muted-foreground">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(product.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="font-medium flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {product.views || 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">In Carts</p>
                  <p className="font-medium flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    {cartDetails.count} users
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">In Wishlists</p>
                  <p className="font-medium flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {wishlistDetails.count} users
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="font-medium flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4" />
                    {orderDetails.count} users
                  </p>
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <Badge key={size} variant="secondary">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Engagement Section */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>
                View users who have interacted with this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="wishlist">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="wishlist" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Wishlists ({wishlistDetails.count})
                  </TabsTrigger>
                  <TabsTrigger value="cart" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Carts ({cartDetails.count})
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Orders ({orderDetails.count})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="wishlist" className="mt-6">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {wishlistDetails.users.map((user) => (
                        <Link 
                          href={`/users/${user.id}`}
                          key={user.id}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Added {formatDate(user.addedAt)}
                            </p>
                          </div>
                        </Link>
                      ))}
                      {wishlistDetails.users.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No users have added this product to their wishlist
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="cart" className="mt-6">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {cartDetails.users.map((user) => (
                        <Link 
                          href={`/users/${user.id}`}
                          key={user.id}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge>Qty: {user.quantity}</Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                Updated {formatDate(user.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {cartDetails.users.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No users have this product in their cart
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {orderDetails.users.map((user) => (
                        <Link 
                          href={`/users/${user.id}`}
                          key={user.id}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge>Qty: {user.quantity}</Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                Ordered {formatDate(user.orderDate)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {orderDetails.users.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No users have ordered this product
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Skeleton className="h-7 w-3/4" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-8 w-32 mt-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>

            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-md" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48 mt-1" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}