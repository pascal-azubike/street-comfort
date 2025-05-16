'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Loader2, Copy, Upload, ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from "axios";
import { useCart } from '@/store/use-cart';


interface ManualPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  transactionRef: string;
  items: any[];
  addressId: string;
}

const BANK_DETAILS = {
  bankName: 'Moniepoint',
  accountNumber: '5035375988',
  accountName: 'Denmark multibuz limited street comfort',
};

export function ManualPaymentDialog({
  isOpen,
  onClose,
  amount,
  transactionRef,
  items,
  addressId,
}: ManualPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const router = useRouter();
  const cart = useCart();

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transactionRef);
    toast({
      title: 'Copied!',
      description: 'Transaction reference copied to clipboard',
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'File must be an image (JPG, PNG, WEBP) or PDF',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setReceiptUrl(response.data.secure_url);
      toast({
        title: 'Success',
        description: 'Receipt uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload receipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!receiptUrl) {
      toast({
        title: 'Error',
        description: 'Please upload your payment receipt',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const transformedItems = items.map(item => ({
        _id: item._id,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
        name: item.name,
        size: item.size,
        image: item.image,
        description: item.description,
        category: item.category,
        details: item.details,
        images: item.images
      }));

      const requestData = {
        receiptUrl,
        transactionRef,
        amount,
        items: transformedItems,
        addressId,
      };

      const response = await fetch('/api/orders/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create order: ${errorData}`);
      }

      const data = await response.json();

      toast({
        title: 'Order Created Successfully',
        description: 'Your order has been created and is pending payment verification. You can track its status in your orders.',
        duration: 5000,
      });

      cart.clearCart();
      router.refresh();
      router.push('/orders');
      onClose();
    } catch (error) {
      console.error('Error creating manual order:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bank Transfer Payment</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Please transfer{' '}
              {amount.toLocaleString('en-NG', {
                style: 'currency',
                currency: 'NGN',
              })}{' '}
              to our bank account and upload your payment receipt.
            </p>
            <p className="text-sm text-muted-foreground">
              Note: Your order will be processed once we verify your payment. You can track the status in your orders.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">Bank Account Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Bank Name:</div>
              <div className="font-medium">{BANK_DETAILS.bankName}</div>
              <div>Account Number:</div>
              <div className="font-medium">{BANK_DETAILS.accountNumber}</div>
              <div>Account Name:</div>
              <div className="font-medium">{BANK_DETAILS.accountName}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transaction Reference (Add to payment remarks)</Label>
            <div className="flex gap-2">
              <Input value={transactionRef} readOnly />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyRef}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Payment Receipt</Label>
            <div className="space-y-4">
              {receiptUrl && (
                <div className="relative w-full h-[120px] bg-gray-50 rounded-lg">
                  <Image
                    fill
                    src={receiptUrl}
                    alt="Receipt"
                    className="object-contain rounded-lg p-2"
                  />
                </div>
              )}
              <div className="relative">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleImageUpload}
                  disabled={isUploading || isSubmitting}
                  className="hidden"
                  id="receipt-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                  disabled={isUploading || isSubmitting}
                  className="w-full border-[#593C2D] text-[#593C2D] hover:bg-[#593C2D] hover:text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {receiptUrl ? 'Change Receipt' : 'Upload Receipt'}
                    </>
                  )}
                </Button>
              </div>
              {receiptUrl && (
                <div className="text-sm text-green-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  Receipt uploaded successfully
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum file size: 5MB. Accepted formats: Images, PDF
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-white py-4 -mx-6 px-6 -mb-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !receiptUrl}
            className="relative"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creating Order...' : 'Confirm Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
