"use client"

import CloudinaryVideo from "@/components/ui/CloudinaryVideo"
import { useReveal } from "@/hooks/useReveal"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { collections, Collection } from "@/config/collections"
import { useRouter } from 'next/navigation'

function CategoryCard({ image, title, description }: Collection) {
  const router = useRouter()

  const handleCategoryClick = () => {
    // Use the same normalization logic as shop-content.tsx
    router.push(`/shop?category=${title.toLowerCase().replace(/\s+&\s+/g, '-')}`)
  }

  return (
    <div className="relative group cursor-pointer" onClick={handleCategoryClick}>
      <div className="bg-[#EBDBC2] rounded-xl p-4 flex items-center gap-4 
        hover:bg-[#EFE5D9] transition-all duration-300 ease-in-out 
        hover:shadow-md transform hover:-translate-y-1
      ">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={48}
            height={48}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[#462901] text-base font-['Playfair_Display'] block truncate">
            {title}
          </span>
          <span className="text-[#462901]/60 text-xs line-clamp-1">
            {description}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 flex-shrink-0 text-[#462901] opacity-0 group-hover:opacity-100 
          transition-all duration-300 transform translate-x-0 group-hover:translate-x-1" />
      </div>
    </div>
  )
}

export default function ChooseType() {
  const revealRef = useReveal()

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto" ref={revealRef}>
      <div className="flex flex-col-reverse lg:flex-row lg:gap-12 lg:items-start">
        {/* Video Section - Left on large screens, bottom on smaller screens */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 reveal delay-1">
          <CloudinaryVideo />
        </div>

        {/* Content and Collections - Right on large screens, top on smaller screens */}
        <div className="lg:w-1/2">
          <div className="text-left mb-8">
            <h2 className="reveal text-[#462901] text-4xl font-['Playfair_Display'] mb-4">
              Our Collections
            </h2>
            <p className="reveal delay-1 text-[#462901]/60 text-sm font-['Segoe_UI']">
              Explore our diverse range of street fashion essentials, from casual wear to statement pieces.
            </p>
          </div>

          {/* Collections Grid - Now 2 columns on all screen sizes */}
          <div className="grid grid-cols-2 gap-4 reveal delay-2">
            {collections.map((collection, index) => (
              <CategoryCard
                key={index}
                {...collection}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 