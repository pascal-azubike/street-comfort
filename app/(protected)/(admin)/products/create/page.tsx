"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "sonner"
import { ProtectedContent } from "@/components/auth/protected-content"
import { Plus, X } from "lucide-react"
import { PageHero } from "@/app/(pages)/pageHero"
import { Collection, collections } from '@/config/collections';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  sizes: z.array(z.string()).min(1, "At least one size must be selected"),
  details: z.array(z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required")
  })),
  images: z.array(z.string()).nonempty("At least one image is required"),
  views: z.number().default(0),
  creator: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
  }).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"] as const;

export default function CreateProduct() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const isEditing = !!productId
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      category: "",
      sizes: [],
      details: [{ key: "", value: "" }],
      images: [],
      views: 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control: form.control,
  })

  const images = form.watch("images")

  // Add state for handling "Select All" functionality
  const [allSizesSelected, setAllSizesSelected] = useState(false);

  // Add function to handle "Select All" toggle
  const handleSelectAllSizes = () => {
    const newValue = !allSizesSelected;
    setAllSizesSelected(newValue);
    form.setValue('sizes', newValue ? [...AVAILABLE_SIZES] : []);
  };

  // Fetch product data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`)
          if (!response.ok) throw new Error("Failed to fetch product")
          
          const product = await response.json()
          
          // Populate form with existing data
          form.reset({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            category: product.category,
            sizes: product.sizes || ["XS", "S", "M", "L", "XL"],
            details: product.details?.length > 0 
              ? product.details 
              : [{ key: "", value: "" }],
            images: product.images || [],
          })
        } catch (error) {
          console.error("Error fetching product:", error)
          toast.error("Failed to fetch product details")
        } finally {
          setInitialLoading(false)
        }
      }

      fetchProduct()
    }
  }, [isEditing, productId, form])

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)

      if (!data.images || data.images.length === 0) {
        toast.error("At least one image is required")
        return
      }

      if (data.sizes.length === 0) {
        toast.error("At least one size must be selected")
        return
      }

      const url = isEditing 
        ? `/api/products/${productId}`
        : "/api/products"

      const method = isEditing ? "PUT" : "POST"

      // Include views in the data
      const submitData = {
        ...data,
        views: 0, // Always set to 0 for new products
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${isEditing ? 'update' : 'create'} product`)
      }

      toast.success(
        isEditing ? "Product updated successfully!" : "Product created successfully!", 
        {
          description: `${data.name} has been ${isEditing ? 'updated' : 'added'} to your store.`,
          action: {
            label: "View Products",
            onClick: () => router.push("/products/manage")
          },
          style: {
            background: 'rgb(74 222 128)',
            color: 'white',
          },
        }
      )

      // Navigate back to products page
      // router.push("/products/manage")

    } catch (error) {
      console.error("Submit error:", error)
      toast.error(
        isEditing ? "Failed to update product" : "Failed to create product",
        {
          description: error instanceof Error ? error.message : "Please try again",
        }
      )
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container max-w-4xl px-8 mx-auto py-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#593C2D] border-r-transparent" />
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedContent requireAdmin>
      <>
        <PageHero
          title={isEditing ? "Edit Product" : "Create New Product"}
          description={isEditing ? "Update product details." : "Add a new product to store."}
        />
        <div className="container max-w-4xl px-8 mx-auto py-8">
          <h1 className="text-2xl font-bold mb-8">
            {isEditing ? "Edit Product" : "Create New Product"}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images ({field.value.length} uploaded)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(urls) => {
                          console.log("Setting new image URLs:", urls);
                          field.onChange(urls);
                          form.trigger("images"); // Trigger validation
                        }}
                        onRemove={(url) => {
                          const newUrls = field.value.filter((current) => current !== url);
                          console.log("Removing image, new URLs:", newUrls);
                          field.onChange(newUrls);
                          form.trigger("images"); // Trigger validation
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Gold Necklace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₦)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="45999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {collections.map((collection: Collection) => (
                          <SelectItem 
                            key={collection.title} 
                            value={collection.title.toLowerCase().replace(/\s+&\s+|\s+/g, '-')}
                          >
                            {collection.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="sizes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Available Sizes</FormLabel>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAllSizes}
                          className={cn(
                            "transition-colors",
                            allSizesSelected && "bg-[#593C2D] text-white hover:bg-[#593C2D]/90"
                          )}
                        >
                          {allSizesSelected ? "Deselect All" : "Select All"}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {AVAILABLE_SIZES.map((size) => (
                          <FormField
                            key={size}
                            control={form.control}
                            name="sizes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={size}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(size)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        const newValue = checked
                                          ? [...current, size]
                                          : current.filter((val) => val !== size);
                                        field.onChange(newValue);
                                        setAllSizesSelected(newValue.length === AVAILABLE_SIZES.length);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {size}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Product Details</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ key: "", value: "" })}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Detail
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`details.${index}.key`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Detail name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`details.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Detail value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="mt-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading || images.length === 0}
                className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
              >
                {loading 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing 
                      ? `Update Product (${images.length} images)`
                      : `Create Product (${images.length} images)`
                  )
                }
              </Button>
            </form>
          </Form>
        </div>
      </>
    </ProtectedContent>
  )
} 