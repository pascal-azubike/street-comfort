"use client";

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
import { UserStatusBadge } from "@/components/ui/user-status-badge";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

// Type definitions
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

type UserDetails = {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    status: "active" | "banned";
    createdAt: string;
    lastActive?: string | null;
  };
  addresses: Address[];
  cartItems: any[];
  wishlistItems: any[];
  orders: Order[];
};

function LoadingSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function UserDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userIds as string;

  const { data: userDetails, isLoading, isError } = useQuery<UserDetails>({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/details`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep status up to date
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
                  <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Online Status</p>
                  <UserStatusBadge 
                    userEmail={user.email}
                    showLastSeen={true}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Cart Items</span>
                  </div>
                  <Badge variant="secondary">{cartItems.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Wishlist Items</span>
                  </div>
                  <Badge variant="secondary">{wishlistItems.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Orders</span>
                  </div>
                  <Badge variant="secondary">{orders.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View all orders placed by this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No orders found
                      </p>
                    ) : (
                      orders.map((order) => (
                        <Card key={order._id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">
                                  Order #{order._id.slice(-8)}
                                </CardTitle>
                                <CardDescription>
                                  {formatDate(order.createdAt)}
                                </CardDescription>
                              </div>
                              <Badge>
                                {order.orderStatus}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items</span>
                                <span>{order.orderItems.length}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Payment</span>
                                <Badge variant={order.paymentStatus === 'successful' ? 'default' : 'destructive'}>
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery</span>
                                <span>{order.deliveryStatus}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>
                  All delivery addresses saved by this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No addresses found
                      </p>
                    ) : (
                      addresses.map((address) => (
                        <Card key={address._id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">
                                {address.label}
                              </CardTitle>
                              <Badge>
                                {address.type}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="text-sm">
                                  <p>{address.street}</p>
                                  <p>{address.city}, {address.state} {address.zipCode}</p>
                                  {address.landmark && (
                                    <p className="text-muted-foreground mt-1">
                                      Landmark: {address.landmark}
                                    </p>
                                  )}
                                  {address.instructions && (
                                    <p className="text-muted-foreground mt-1">
                                      Instructions: {address.instructions}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default function UserDetailsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserDetailsContent />
    </QueryClientProvider>
  );
}
