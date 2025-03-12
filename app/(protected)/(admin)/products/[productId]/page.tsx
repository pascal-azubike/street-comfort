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
  Users,
  Edit,
  Calendar,
  Package,
  Tag
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNairaPrice } from "@/lib/utils";

export default function ViewProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const { data: productDetails, isLoading, isError } = useQuery({
    queryKey: ['product-details', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}/admin-details`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      return response.json();
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !productDetails) {
    return (
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
    );
  }

  const { product, cartDetails, wishlistDetails } = productDetails;

  return (
    <>
      <PageHero
        title="Product Details"
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
                {product.images.length} images available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden border group"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}/{product.images.length}
                    </div>
                  </div>
                ))}
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
                <h3 className="font-semibold text-xl line-clamp-2">{product.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.brand && (
                    <Badge variant="outline">{product.brand}</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-primary mt-3">
                  {formatNairaPrice(product.price)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(product.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-medium flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {product.stock} units
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

          {/* Detailed Stats Section */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Product Details & Engagement</CardTitle>
              <CardDescription>
                Detailed information about the product and user engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description">
                <div className="overflow-auto pb-2">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="description" className="flex-shrink-0">
                      <Info className="h-4 w-4 mr-2" />
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="carts" className="flex-shrink-0">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      In Carts ({cartDetails.count})
                    </TabsTrigger>
                    <TabsTrigger value="wishlists" className="flex-shrink-0">
                      <Heart className="h-4 w-4 mr-2" />
                      In Wishlists ({wishlistDetails.count})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="description">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose max-w-none">
                        <p>{product.description}</p>
                      </div>
                      
                      {product.details && product.details.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-3">Additional Details</h4>
                          <div className="grid gap-2">
                            {product.details.map((detail: any, index: number) => (
                              <div key={index} className="flex items-center gap-2 py-2 px-3 bg-muted rounded-lg">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{detail.key}:</span>
                                <span>{detail.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="carts">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <CardTitle>Cart Engagement</CardTitle>
                      </div>
                      <CardDescription>
                        Users who currently have this product in their cart
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {cartDetails.users.map((user: any) => (
                            <div 
                              key={user.id} 
                              className="flex items-center justify-between p-3 rounded-lg border"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.image} />
                                  <AvatarFallback>
                                    {user.name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Added to cart
                                  </p>
                                </div>
                              </div>
                              <Badge>
                                Qty: {user.quantity}
                              </Badge>
                            </div>
                          ))}
                          {cartDetails.users.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No users have this product in their cart
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wishlists">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        <CardTitle>Wishlist Engagement</CardTitle>
                      </div>
                      <CardDescription>
                        Users who have added this product to their wishlist
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {wishlistDetails.users.map((user: any) => (
                            <div 
                              key={user.id} 
                              className="flex items-center justify-between p-3 rounded-lg border"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.image} />
                                  <AvatarFallback>
                                    {user.name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Added {formatDate(user.addedAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {wishlistDetails.users.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No users have this product in their wishlist
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
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
      <div className="mb-6">
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-[200px]" />
              <Skeleton className="h-5 w-[150px]" />
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
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-[250px]" />
              <Skeleton className="h-5 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-[400px] w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 