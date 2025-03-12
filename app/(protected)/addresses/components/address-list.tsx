"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AddressForm } from "./address-form-client";
import { toast } from "@/hooks/use-toast";

interface Address {
  _id: string;
  type: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  instructions?: string;
  isDefault: boolean;
  userId?: string;
}

interface AddressListProps {
  initialAddresses: Address[];
}

async function fetchAddresses() {
  const response = await fetch('/api/addresses');
  if (!response.ok) throw new Error('Failed to fetch addresses');
  const data = await response.json();
  // Transform the data to ensure proper format
  return data.map((addr: any) => ({
    ...addr,
    _id: addr._id.toString(),
    userId: addr.userId?.toString()
  }));
}

function AddressCardSkeleton() {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2">
            <div className="h-5 w-24 bg-muted rounded" />
            <div className="h-5 w-16 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function AddressList({ initialAddresses }: AddressListProps) {
  const queryClient = useQueryClient();
  const [addresses, setAddresses] = useState(initialAddresses);
  
  const { data: fetchedAddresses, isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    initialData: initialAddresses,
    staleTime: 0, // Consider data stale immediately
    refetchOnMount: true,
    retry: 1
  });

  useEffect(() => {
    if (error) {
      console.error('Query error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load addresses. Please try again."
      });
    }
  }, [error]);

  const handleDelete = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete address');
      
      // Invalidate and refetch addresses
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      
      toast({
        title: "Address Deleted",
        description: "The address has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete address. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button asChild>
          <Link href="/addresses/add">Add New Address</Link>
        </Button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <>
            <AddressCardSkeleton />
            <AddressCardSkeleton />
            <AddressCardSkeleton />
          </>
        ) : !fetchedAddresses || fetchedAddresses.length === 0  ? (
          <div className="text-center py-8 bg-card rounded-lg">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No addresses found</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/addresses/add">Add Your First Address</Link>
            </Button>
          </div>
        ) : (
          fetchedAddresses.map((address: Address) => (
            <div key={address._id} className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{address.label}</h3>
                    <Badge variant={address.isDefault ? "default" : "outline"}>
                      {address.type}
                    </Badge>
                    {address.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.street}<br />
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  {address.landmark && (
                    <p className="text-sm text-muted-foreground">
                      Landmark: {address.landmark}
                    </p>
                  )}
                  {address.instructions && (
                    <p className="text-sm text-muted-foreground">
                      Instructions: {address.instructions}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/addresses/add?addressId=${address._id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(address._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
} 