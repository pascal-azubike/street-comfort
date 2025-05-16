"use client";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useState } from "react";

export interface AddressFormValues {
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

export function AddressForm({ addressId }: { addressId?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: AddressFormValues) => {
    setIsLoading(true);
    try {
      console.log("Submitting address update:", {
        addressId,
        data
      });

      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Address update failed:", errorText);
        throw new Error('Failed to save address');
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: "Address saved successfully",
      });
      router.push('/addresses');
    } catch (error) {
      console.error("Failed to save address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save address. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Your form JSX here
    <div>
      <h1>Address Form</h1>
    </div>
  );
} 