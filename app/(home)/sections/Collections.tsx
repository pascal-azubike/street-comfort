'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useCart } from "@/store/use-cart"
import { toast } from "sonner"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: string
  description: string
  category: string
  colors: string[]
  sizes: string[]
  details: { key: string; value: string }[]
  images: string[]
}

function CollectionItem({ product }: { product: Product }) {
  const cart = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling

    if (!product.sizes || product.sizes.length === 0) {
      toast.error('Product has no available sizes')
      return
    }

    cart.addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes[0], // Use first available size
      image: product.images[0],
      description: product.description,
      category: product.category,
      details: product.details || [],
      images: product.images,
    })

    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`,
      action: {
        label: 'View Cart',
        onClick: () => (window.location.href = '/cart'),
      },
    })
  }

  return (
    <Link href={`/shop/${product._id}`} className="block">
      <div className="relative group">
        <div className="relative rounded-2xl overflow-hidden bg-white">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-[300px] object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-[1.02]"
          />
          <button
            onClick={handleAddToCart}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-[#462901]"
          >
            <ShoppingBag className="w-5 h-5 fill-[#462901] text-white transition-colors duration-300 ease-in-out group-hover:fill-white group-hover:text-black" />
          </button>
        </div>
        <div className="mt-4 text-center flex items-center flex-col">
          <h3 className="text-[#462901] font-['Playfair_Display']">{product.name}</h3>
          <p className="text-black font-['Segoe_UI'] bg-white rounded-2xl max-w-fit py-1 px-3 mt-1">
            ₦{formatNairaPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  )
}

const formatNairaPrice = (price: string) => {
  const number = parseInt(price, 10);
  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(number);
};

const fetchProducts = async () => {
  const res = await fetch(`/api/products/allProduct`)
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()
  return data.items.slice(0, 6)
}

export default function Collections() {
  const { data: products, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchProducts,
  })

  if (isLoading) {
    return (
      <section className="py-16 m-4 px-4 bg-[#FDF7F5] max-w-5xl my-12 rounded-3xl mx-auto">
        <div className="text-center text-[#462901]">
          <div className="animate-spin mb-2">
            <RefreshCw className="w-6 h-6 mx-auto" />
          </div>
          Loading collections...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 m-4 px-4 bg-[#FDF7F5] max-w-5xl my-12 rounded-3xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load collections</p>
          <Button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="bg-[#462901] text-white hover:bg-[#593C2D] rounded-full px-6 py-2 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 my-24 m-4 px-4 bg-[#FDF7F5] max-w-5xl  rounded-3xl mx-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row container mx-auto gap-8 items-center">
          {/* Left Content - Hidden on medium and below */}
          <div className="hidden self-start
           lg:block lg:w-1/3 text-center lg:text-left">
            <h2 className="text-[#462901] text-4xl font-['Playfair_Display'] mb-4">
              Featured Collections
            </h2>
            <p className="text-[#8B7B73] max-w-md mx-auto lg:mx-0 text-sm font-['Segoe_UI'] mb-6">
              Explore our curated streetwear collection, featuring pieces that combine modern style with everyday comfort. Each design offers a fresh take on contemporary fashion.
            </p>
            <div>
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="border-[#462901] border text-[#462901] hover:bg-[#462901] hover:text-white rounded-full px-8 py-2 font-['Segoe_UI'] text-base font-normal"
                >
                  View All
                </Button>
              </Link>
            </div>
          </div>

          {/* Title for medium and below screens */}
          <div className="lg:hidden text-center w-full">
            <h2 className="text-[#462901] text-4xl font-['Playfair_Display'] mb-4">
              Featured Collections
            </h2>
            <p className="text-[#462901]/60 max-w-md mx-auto text-sm font-['Segoe_UI'] mb-6">
              Discover our latest streetwear pieces that blend Lagos's vibrant energy with contemporary style. Each piece tells a story of urban culture and modern comfort.
            </p>
          </div>

          {/* Right Collection Grid */}
          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products?.map((product: Product) => (
                <div key={product._id} className="flex justify-center">
                  <CollectionItem product={product} />
                </div>
              ))}
            </div>

            {/* View All button for medium and below screens */}
            <div className="mt-8 text-center lg:hidden">
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="border-[#462901] border text-[#462901] hover:bg-[#462901] hover:text-white rounded-full px-8 py-2 font-['Segoe_UI'] text-base font-normal"
                >
                  View All Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 