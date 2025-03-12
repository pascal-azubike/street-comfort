'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
}

async function fetchAddresses() {
  const response = await fetch('/api/addresses');
  if (!response.ok) throw new Error('Failed to fetch addresses');
  const data = await response.json();
  return data.map((addr: any) => ({
    ...addr,
    _id: addr._id.toString(),
    userId: addr.userId?.toString()
  }));
}

interface AddressSelectorProps {
  selectedAddressId?: string;
  onAddressSelect: (addressId: string) => void;
  returnUrl?: string;
}

export function AddressSelector({ selectedAddressId, onAddressSelect, returnUrl }: AddressSelectorProps) {
  const router = useRouter();
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="h-10 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm text-muted-foreground">No delivery addresses found.</p>
        <Link 
          href={`/addresses/add${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
          className="inline-flex items-center"
        >
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select
          value={selectedAddressId}
          onValueChange={onAddressSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a delivery address" />
          </SelectTrigger>
          <SelectContent>
            {addresses.map((address: Address) => (
              <SelectItem key={address._id} value={address._id}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {address.label} - {address.street}, {address.city}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Link 
        href={`/addresses/add${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
        className="inline-flex items-center"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </Link>
    </div>
  );
}
