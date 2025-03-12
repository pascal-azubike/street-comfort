"use client";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";
import { PageHero } from "@/app/(pages)/pageHero";

export default function PaymentMethodsPage() {
  return (
    <>
      <PageHero 
        title="Payment Methods" 
        description="Manage your payment options for quick and secure checkout."
      />
      <div className="container max-w-4xl px-8 mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center py-8 bg-card rounded-lg">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No payment methods found</p>
          </div>
        </div>
      </div>
    </>
  );
} 