'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { PageHero } from '@/app/(pages)/pageHero';

const addressSchema = z.object({
  type: z.enum(['home', 'work', 'other'], {
    required_error: 'Please select an address type.',
  }),
  label: z.string().min(2, {
    message: 'Address label must be at least 2 characters.',
  }),
  street: z.string().min(5, {
    message: 'Street address must be at least 5 characters.',
  }),
  city: z.string().min(2, {
    message: 'City must be at least 2 characters.',
  }),
  state: z.string().min(2, {
    message: 'State must be at least 2 characters.',
  }),
  zipCode: z.string().min(5, {
    message: 'ZIP code must be at least 5 characters.',
  }),
  isDefault: z.boolean().default(false),
  instructions: z.string().optional(),
  landmark: z.string().optional(),
});

const inputClassName = 'max-w-[280px] w-full';
const textareaClassName = 'max-w-[560px] w-full';

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">
          Loading address details...
        </p>
      </div>
    </div>
  );
}

export default function AddAddressPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const searchParams = useSearchParams();
  const addressId = searchParams.get('addressId');
  const returnUrl = searchParams.get('returnUrl');
  const isEditing = !!addressId;
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'home',
      isDefault: false,
      instructions: '',
      landmark: '',
    },
  });

  // Fetch address data if editing
  useEffect(() => {
    const fetchAddress = async () => {
      if (!addressId) return;

      try {
        setIsFetching(true);
        const response = await fetch(`/api/addresses/${addressId}`);
        if (!response.ok) throw new Error('Failed to fetch address');
        const data = await response.json();

        form.reset({
          type: data.type,
          label: data.label,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          landmark: data.landmark || '',
          instructions: data.instructions || '',
          isDefault: data.isDefault,
        });
      } catch (error) {
        console.error('Error fetching address:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load address information. Please try again.',
        });
        router.push('/addresses');
      } finally {
        setIsFetching(false);
      }
    };

    fetchAddress();
  }, [addressId, form, router]);

  async function onSubmit(values: z.infer<typeof addressSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch(
        addressId ? `/api/addresses/${addressId}` : '/api/addresses',
        {
          method: addressId ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error('Failed to save address');

      // Invalidate addresses cache
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });

      toast({
        title: 'Success',
        description: `Address ${isEditing ? 'updated' : 'added'} successfully.`,
      });

      // Redirect to the return URL if it exists, otherwise go to addresses page
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/addresses');
      }
    } catch (error) {
      console.error('Failed to save address:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${
          isEditing ? 'update' : 'add'
        } address. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHero
        title={isEditing ? 'Edit Address' : 'Add New Address'}
        description={
          isEditing
            ? 'Update your delivery address information.'
            : 'Add a new delivery address to your account.'
        }
      />
      <div className="container max-w-4xl px-8 mx-auto py-8">
        {isFetching && <LoadingOverlay />}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? 'Update your delivery address information.'
                : 'Add a new delivery address to your account.'}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputClassName}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Label</FormLabel>
                      <FormControl>
                        <Input
                          className={inputClassName}
                          placeholder="e.g., My Home"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Textarea
                        className={textareaClassName}
                        placeholder="Enter your complete street address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          className={inputClassName}
                          placeholder="Your City"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          className={inputClassName}
                          placeholder="Your State"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input
                          className={inputClassName}
                          placeholder="ZIP Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Landmark (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          className={inputClassName}
                          placeholder="Nearby landmark"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        className={textareaClassName}
                        placeholder="Any special instructions for delivery"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any special instructions for delivery (e.g., security,
                      preferred delivery time)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default address</FormLabel>
                      <FormDescription>
                        This address will be used as the default for deliveries
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isEditing ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    'Save Address'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
