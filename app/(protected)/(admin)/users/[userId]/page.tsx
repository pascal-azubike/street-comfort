"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/app/(pages)/pageHero";
import { formatNairaPrice, formatDate } from "@/lib/utils";
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
  MapPin,
  ShoppingCart,
  Heart,
  Package,
  Mail,
  Phone,
  Calendar,
  User,
  Clock
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Update type definitions
type OrderItem = {
  productId: string;
  quantity: number;
  price: string | number;
  amount: number;
  transactionRef: string;
};

type Address = {
  _id: string;
  type: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  instructions?: string;
};

type DeliveryDetails = {
  isDelivered: boolean;
  deliveredAt: string | null;
  estimatedDeliveryDate: string | null;
  trackingNumber: string | null;
};

type FlutterwaveData = {
  id: number;
  tx_ref: string;
  flw_ref: string;
  amount: number;
  currency: string;
  status: string;
  payment_type: string;
  created_at: string;
  processor_response: string;
  customer: {
    name: string;
    email: string;
    phone_number: string;
  };
};

type Order = {
  _id: string;
  orderItems: OrderItem[];
  address: Address;
  paymentStatus: string;
  orderStatus: string;
  deliveryStatus: string;
  createdAt: string;
  updatedAt: string;
  deliveryDetails: DeliveryDetails;
  paymentData: {
    verificationResult: string;
    verifiedAt: string;
  };
  flutterwaveResponse: {
    status: string;
    message: string;
    data: FlutterwaveData;
  };
};

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { data: userDetails, isLoading, isError } = useQuery({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/details`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      console.log('Component Data:', {
        ordersCount: data.orders?.length,
        sampleOrder: data.orders?.[0],
        cartItems: data.cartItems?.length,
        wishlistItems: data.wishlistItems?.length
      });
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !userDetails) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Failed to load user details</h2>
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

  const { user, addresses, cartItems, wishlistItems, orders } = userDetails;

  return (
    <>
      <PageHero
        title="User Details"
        description="Comprehensive view of user information and activity."
      />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        {/* User Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'}>
                    {user.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="text-sm font-medium">{formatDate(user.lastLogin || user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>Total Orders</span>
                  </div>
                  <Badge variant="secondary">{orders.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span>Cart Items</span>
                  </div>
                  <Badge variant="secondary">{cartItems.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Wishlist Items</span>
                  </div>
                  <Badge variant="secondary">{wishlistItems.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Saved Addresses</span>
                  </div>
                  <Badge variant="secondary">{addresses.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="orders">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                <TabsTrigger value="orders">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </TabsTrigger>
                <TabsTrigger value="wishlist">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger value="addresses">
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {orders.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No orders found
                      </p>
                    ) : (
                      orders.map((order: Order) => (
                        <div
                          key={order._id}
                          onClick={() => router.push(`/admin/orders/${order._id}`)}
                          className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-accent/50 transition-colors rounded bg-muted/50"
                        >
                          <span className="font-mono text-sm">
                            {order._id}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="cart" className="mt-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Cart is empty
                      </p>
                    ) : (
                      cartItems.map((item: any) => (
                        <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} • Size: {item.size}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              {formatNairaPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="wishlist" className="mt-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {wishlistItems.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Wishlist is empty
                      </p>
                    ) : (
                      wishlistItems.map((item: any) => (
                        <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Added: {formatDate(item.addedAt)}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              {formatNairaPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="addresses" className="mt-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No saved addresses
                      </p>
                    ) : (
                      addresses.map((address: any) => (
                        <Card key={address._id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {address.type || 'Address'}
                              </CardTitle>
                              {address.isDefault && (
                                <Badge>Default</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p>{address.street}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-muted-foreground mt-2">
                                📞 {address.phone}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
} 