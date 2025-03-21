"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, MoreHorizontal, Eye, Edit, Archive, Trash2, Loader2, Search, Filter, ArrowUpDown, RefreshCcw, ShoppingCart, Heart, ShoppingBag, Copy, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/app/(pages)/pageHero";
import { formatNairaPrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  availability: string;
  images: string[];
  brand?: string;
  cartCount: number;
  wishlistCount: number;
  orderCount: number;
};

// Table loading skeleton
function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
    </TableRow>
  );
}

function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const { refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(product._id);
      setHasCopied(true);
      toast.success("Product ID copied to clipboard");
      setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error("Failed to copy product ID");
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      await refetch();
      setShowDeleteDialog(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
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
          <DropdownMenuItem onClick={copyId}>
            {hasCopied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push(`/products/${product._id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push(`/products/create?id=${product._id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ManageProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const debouncedSearch = useDebounce(search, 500);
  const [sorting, setSorting] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({
    column: 'createdAt',
    direction: 'desc'
  });
  
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const response = await fetch('/api/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', page, pageSize, debouncedSearch, category, sorting],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: sorting.column,
        sortDirection: sorting.direction,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category !== 'all' && { category }),
      });

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  const products: Product[] = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const totalProducts = data?.total || 0;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/products/manage') {
        handleRefresh();
      }
    };

    window.addEventListener('popstate', () => handleRouteChange(window.location.pathname));
    return () => {
      window.removeEventListener('popstate', () => handleRouteChange(window.location.pathname));
    };
  }, []);

  const handleSort = (column: string) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <>
      <PageHero
        title="Manage Products"
        description="Add, edit, and manage your product catalog."
      />

      <section className="py-8 sm:py-12 bg-[#FDF7F5]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Products</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your product catalog
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isFetching}
              >
                <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
              <Button asChild>
                <Link href="/products/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-[280px]">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, ID, category..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                    {isFetching && (
                      <div className="absolute right-2 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                  <Button
                    variant={category === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setCategory('all');
                      setPage(1);
                    }}
                  >
                    All
                  </Button>
                  {categories?.map((cat: string) => (
                    <Button
                      key={cat}
                      variant={category === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCategory(cat);
                        setPage(1);
                      }}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                <div className="lg:hidden flex gap-2 items-center">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((cat: string) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-card rounded-lg border overflow-hidden relative">
            {isFetching && !isLoading && (
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
                    <TableHead>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('_id')}>
                        Product ID
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('title')}>
                        Product Details
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('price')}>
                        Price
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('orderCount')}>
                        <ShoppingBag className="h-4 w-4" />
                        Orders
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('cartCount')}>
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('wishlistCount')}>
                        <Heart className="h-4 w-4" />
                        Wishlist
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(pageSize).fill(0).map((_, i) => (
                      <TableRowSkeleton key={i} />
                    ))
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="text-center py-12">
                          <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-2 text-sm font-semibold">No products</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Get started by creating a new product.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">
                          {(page - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-muted-foreground whitespace-nowrap">
                            <span className="hidden xl:inline">{product._id}</span>
                            <span className="xl:hidden">
                              {product._id.substring(0, 8)}...
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium line-clamp-1">{product.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{product.category}</span>
                                {product.brand && (
                                  <>
                                    <span>•</span>
                                    <span>{product.brand}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatNairaPrice(product.price.toString())}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.orderCount || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.cartCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.wishlistCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <ProductActions product={product} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!isLoading && products.length > 0 && (
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
                    {totalProducts > 0 ? (
                      <span>
                        {(page - 1) * pageSize + 1}-
                        {Math.min(page * pageSize, totalProducts)} of {totalProducts}
                      </span>
                    ) : (
                      "No results"
                    )}
                  </div>
                </div>

                <Pagination>
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
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={page}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 1 && value <= totalPages) {
                              setPage(value);
                            }
                          }}
                          className="h-8 w-[60px] text-center"
                        />
                        <span className="text-sm text-muted-foreground">
                          of {totalPages}
                        </span>
                      </div>
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
            )}
          </div>
        </div>
      </section>
    </>
  );
}