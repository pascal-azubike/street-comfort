"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink, RotateCcw, MoreHorizontal, Eye, CreditCard, XCircle, Star, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from 'next/navigation';

import LoadingView from "@/components/views/LoadingView";
import * as timeago from 'timeago.js';
import { PageHero } from "@/app/(pages)/pageHero";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils";

type OrderItem = {
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size: string;
  description: string;
  category: string;
  details: { key: string; value: string }[];
  images: string[];
};

type Order = {
  _id: string;
  userId: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
  orderStatus: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryStatus: 'not-started' | 'in-progress' | 'delivered';
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  paymentId?: string;
  transactionRef?: string;
  address: {
    type: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
    instructions?: string;
  };
  paymentData?: {
    verificationResult?: string;
    verifiedAt?: string;
    flutterwaveResponse?: any;
    processorResponse?: string;
    lastVerificationAttempt?: string;
    cancellationReason?: string;
  };
  deliveryDetails?: {
    isDelivered: boolean;
    deliveredAt: string | null;
    estimatedDeliveryDate: string | null;
    trackingNumber: string | null;
  };
  paymentType?: string;
};

const statusColors = {
  pending: "warning",
  completed: "success",
  failed: "destructive",
  cancelled: "warning",
  processing: "info",
  delivered: "success",
  "not-started": "warning",
  "in-progress": "info",
} as const;

// Add these styles to handle different badge colors
const badgeVariantStyles = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
} as const;

// Update the Badge component to use custom styles
function StatusBadge({ status }: { status: keyof typeof statusColors }) {
  const variant = statusColors[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeVariantStyles[variant]}`}>
      {status}
    </span>
  );
}

// Add this helper function at the top level
const formatDate = (date: Date | string) => {
  const now = new Date();
  const orderDate = new Date(date);
  const diffInDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays <= 2) {
    return timeago.format(orderDate);
  }
  return format(orderDate, 'MMM d, yyyy');
};

function OrderDetailsDialog({ order, open, onClose }: {
  order: Order;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleVerifyPayment = (order: Order) => {
    router.push(`/order-success?orderId=${order._id}&transactionRef=${order.transactionRef}&status=pending`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto z-[9999999]">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-semibold">
            Order Details #{order?._id.substring(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:gap-6">
          {/* Order Status */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Order Status</p>
              <StatusBadge status={order?.orderStatus as keyof typeof statusColors} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Payment Status</p>
              <StatusBadge status={order?.paymentStatus as keyof typeof statusColors} />
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <p className="text-sm font-medium">Delivery Status</p>
              <StatusBadge status={order?.deliveryStatus as keyof typeof statusColors} />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium mb-2">Order Items</h3>
            <ScrollArea className="h-[200px] sm:h-[300px]">
              <div className="space-y-3 sm:space-y-4">
                {order?.orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors cursor-pointer"
                    onClick={() => router.push(`/shop/${item.productId}`)}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{item.name}</p>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                        <p>Size: {item.size}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>₦{parseInt(item.price).toLocaleString()}/each</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-sm sm:text-base">
                        ₦{(item.quantity * parseInt(item.price)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-sm font-medium mb-2">Delivery Address</h3>
            <div className="bg-accent/50 p-4 rounded-lg space-y-2">
              <p className="font-medium">{order?.address?.label}</p>
              {order?.address ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {order?.address.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order?.address.city}, {order?.address.state} {order?.address.zipCode}
                  </p>
                  {order?.address.landmark && (
                    <p className="text-sm text-muted-foreground">
                      Landmark: {order?.address.landmark}
                    </p>
                  )}
                  {order?.address.instructions && (
                    <p className="text-sm text-muted-foreground">
                      Instructions: {order?.address.instructions}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Address not available</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-medium mb-2">Order Summary</h3>
            <div className="bg-accent/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Order Date</span>
                <span>{format(new Date(order?.createdAt), 'PPP')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated</span>
                <span>{format(new Date(order?.updatedAt), 'PPP')}</span>
              </div>
              {order.transactionRef && (
                <div className="flex justify-between text-sm">
                  <span>Transaction Reference</span>
                  <span className="font-mono">{order?.transactionRef}</span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Amount</span>
                <span>₦{order.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {order.paymentStatus === 'pending' && order.paymentType !== 'manual' && (
              <Button
                variant="default"
                onClick={() => handleVerifyPayment(order)}
              >
                Verify Payment
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Update the OrderActions component
function OrderActions({ order, onViewDetails }: {
  order: Order;
  onViewDetails: (order: Order) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
  });

  const handleVerifyPayment = (order: Order) => {
    router.push(`/order-success?orderId=${order._id}&transactionRef=${order.transactionRef}&status=pending`);
  };

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${order._id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel order');

      await refetch(); // Refetch orders to update the table
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error canceling order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onViewDetails(order)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          {/* Update the verify payment action */}
          {order.paymentStatus === 'pending' && order.paymentType !== 'manual' && (
            <DropdownMenuItem onClick={() => handleVerifyPayment(order)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Verify Payment
            </DropdownMenuItem>
          )}

          {order.orderStatus === 'pending' && (
            <DropdownMenuItem
              onClick={() => setShowCancelDialog(true)}
              className="text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </DropdownMenuItem>
          )}

          {order.deliveryStatus === 'delivered' && (
            <DropdownMenuItem onClick={() => router.push(`/review/order/${order._id}`)}>
              <Star className="mr-2 h-4 w-4" />
              Write Review
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => router.push(`/support/order/${order._id}`)}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Get Help
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, cancel order'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Add this new component for the table loading state
function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-full ml-auto" />
      </TableCell>
    </TableRow>
  );
}

// Add this new component for page input
function PageInput({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage = parseInt(inputValue);
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={totalPages}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-16 h-8 rounded-md border border-input bg-background px-2 text-sm"
      />
      <span className="text-sm text-muted-foreground">of {totalPages}</span>
    </form>
  );
}

// Update the TableLoadingOverlay component
function TableLoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
      <div className="flex items-center gap-2 text-[#593C2D]">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading data...</span>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Add new state for tracking loading operations
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  // Check if we're coming from cart/payment
  const fromPayment = searchParams.get('from') === 'payment';

  // Update the query configuration
  const {
    data: ordersData,
    isFetching,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['orders', page, pageSize, currentFilter],
    queryFn: async () => {
      const response = await fetch(
        `/api/orders?page=${page}&pageSize=${pageSize}${currentFilter ? `&status=${currentFilter}` : ''}`
      );
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setTotalPages(Math.ceil(data.total / pageSize));
      setTotalOrders(data.total);
      return data;
    },
  });

  const filteredOrders = ordersData?.orders || [];
  const showLoading = isFetching && !isRefetching;

  // Effect to handle initial load and auto-refresh when coming from payment
  useEffect(() => {
    if (fromPayment && isInitialLoad) {
      const timer = setTimeout(() => {
        refetch().then(() => {
          setIsInitialLoad(false);
        });
      }, 1000); // Wait 1 second before fetching to show loading state
      return () => clearTimeout(timer);
    } else {
      setIsInitialLoad(false);
    }
  }, [fromPayment, refetch, isInitialLoad]);

  // Handle refresh click
  const handleRefresh = async () => {
    try {
      await refetch();
      router.refresh(); // Refresh the Next.js cache
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Update filter handler
  const handleFilterChange = (filter: string | null) => {
    setCurrentFilter(filter);
    setPage(1); // Reset to first page when filtering
  };

  return (
    <>
      <PageHero
        title="My Orders"
        description="Track and manage all your orders in one place. View order status, payment details, and delivery information."
      />

      <section className="py-8 sm:py-12 bg-[#FDF7F5]">
        <div className="container max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['All', 'Pending', 'Processing', 'Confirmed', 'Delivered', 'Cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={currentFilter === status.toLowerCase() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange(status === 'All' ? null : status.toLowerCase())}
                  className="whitespace-nowrap"
                  disabled={isFilterLoading} // Disable during filter operation
                >
                  {status}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
              className="flex items-center gap-2 sm:ml-4"
            >
              <RotateCcw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          <div className={cn(
            "bg-card rounded-lg border overflow-hidden relative",
            showLoading && "opacity-60"
          )}>
            {showLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-50">
                <div className="flex items-center gap-2 text-[#593C2D]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading data...</span>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">S/N</TableHead>
                    <TableHead className="whitespace-nowrap">Order ID</TableHead>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Total</TableHead>
                    <TableHead className="whitespace-nowrap sm:table-cell hidden">Type</TableHead>
                    <TableHead className="whitespace-nowrap sm:table-cell hidden">Payment</TableHead>
                    <TableHead className="whitespace-nowrap sm:table-cell hidden">Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="text-center py-12">
                          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-2 text-sm font-semibold">No orders found</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {currentFilter
                              ? `No ${currentFilter} orders found`
                              : 'You haven\'t placed any orders yet'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders?.map((order: any, index: number) => (
                      <TableRow
                        key={order._id}
                        className={`hover:bg-muted/50 transition-colors ${fromPayment && order.transactionRef === searchParams.get('ref')
                            ? 'bg-muted/10'
                            : ''
                          }`}
                      >
                        <TableCell className="text-muted-foreground">
                          {(page - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          #{order?._id.substring(0, 8)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(order?.createdAt)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order?.orderStatus as keyof typeof statusColors} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ₦{order?.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="capitalize">
                            {order?.paymentType || "automatic"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <StatusBadge status={order?.paymentStatus as keyof typeof statusColors} />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <StatusBadge status={order?.deliveryStatus as keyof typeof statusColors} />
                        </TableCell>
                        <TableCell className="text-right">
                          <OrderActions
                            order={order}
                            onViewDetails={handleOrderClick}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {!showLoading && !filteredOrders?.length ? null : (
              <div className="mt-4 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>Rows per page:</div>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 30, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div>
                    {ordersData?.total ? (
                      <span>
                        {(page - 1) * pageSize + 1}-
                        {Math.min(page * pageSize, totalOrders)} of {totalOrders}
                      </span>
                    ) : (
                      "No results"
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <PageInput
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />

                  <Pagination className="m-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}

// Add this helper function to get status messages
function getOrderStatusMessage(order: Order): string {
  switch (order.orderStatus) {
    case 'pending':
      return 'Awaiting confirmation';
    case 'processing':
      return 'Order is being processed';
    case 'confirmed':
      return 'Order has been confirmed';
    case 'delivered':
      return `Delivered ${order.deliveryDetails?.deliveredAt ? formatDate(order.deliveryDetails.deliveredAt) : ''}`;
    case 'cancelled':
      return 'Order was cancelled';
    default:
      return '';
  }
}
