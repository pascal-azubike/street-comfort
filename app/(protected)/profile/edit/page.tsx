"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { PageHero } from "@/app/(pages)/pageHero";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  preferredContact: z.enum(["email", "phone", "whatsapp"], {
    required_error: "Please select your preferred contact method.",
  }),
  alternatePhone: z.string().optional(),
  businessName: z.string().optional(),
  taxId: z.string().optional(),
});

const inputClassName = "max-w-[280px] w-full";
const textareaClassName = "max-w-[560px] w-full";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">Loading profile details...</p>
      </div>
    </div>
  );
}

export default function UpdateProfile() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      preferredContact: "email",
      alternatePhone: "",
      businessName: "",
      taxId: "",
    },
  });

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsFetching(true);
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        
        form.reset({
          name: data.name || "",
          phone: data.phone || "",
          preferredContact: data.preferredContact || "email",
          alternatePhone: data.alternatePhone || "",
          businessName: data.businessName || "",
          taxId: data.taxId || "",
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information. Please try again.",
        });
        router.push('/profile');
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          email: session?.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await update();
      toast({
        title: "Profile Updated",
        description: "Your information has been successfully updated.",
      });
      router.refresh();
      router.push('/profile');
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailChange(newEmail: string) {
    try {
      // Basic email validation
      if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please enter a valid email address.",
        });
        return;
      }

      const response = await fetch("/api/user/email/change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail }),
      });

      if (!response.ok) throw new Error("Failed to initiate email change");

      toast({
        title: "Verification Email Sent",
        description: "Please check your new email address for a verification link.",
      });
    } catch (error) {
      console.error("Email change failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate email change. Please try again.",
      });
    }
  }

  return (
    <>
      <PageHero 
        title="Edit Profile" 
        description="Update your personal information and account preferences."
      />
      <div className=" px-8 container max-w-4xl mx-auto py-8">
        {isFetching && <LoadingOverlay />}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Profile Information</h3>
            <p className="text-sm text-muted-foreground">
              Update your personal and business information.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Personal Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="234 XXX XXXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternative Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="234 XXX XXXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="preferredContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputClassName}>
                            <SelectValue placeholder="Select preferred contact method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 border-t pt-12 ">
                <h4 className="text-sm font-medium">Email Settings</h4>
                <div className="space-y-2">
                  <FormLabel className="text-muted-foreground">Current Email</FormLabel>
                  <div className="flex items-center gap-4">
                    <Input 
                      className={inputClassName} 
                      value={session?.user?.email || ''} 
                      disabled 
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newEmail = window.prompt('Enter your new email address:');
                        if (newEmail) {
                          handleEmailChange(newEmail);
                        }
                      }}
                    >
                      contact admin
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Changing your email requires admin verification 
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-12">
                <h4 className="text-sm font-medium">Business Information (Optional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Your Business Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID/VAT Number</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Tax ID or VAT Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
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