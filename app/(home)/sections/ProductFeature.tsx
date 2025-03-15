'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useReveal } from "@/hooks/useReveal"
import Link from "next/link"

export default function ProductFeature() {
  const revealRef = useReveal()

  return (
    <section className="py-16 px-4" ref={revealRef}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#FDF7F5] rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="reveal delay-1 lg:col-span-1">
              {/* Left Content */}
              <div className="text-center max-w-lg mx-auto  lg:text-left">
                <h2 className="text-[#593C2D] text-4xl font-['Playfair_Display'] mb-4">
                  Street Comfort T-Shirt
                </h2>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-[#593C2D] text-sm">(4.9/5)</span>
                  <span className="text-[#593C2D] text-sm">1,234 Reviews</span>
                </div>

                <p className="font-['Segoe_UI'] text-[14px] leading-[26px] text-[#593C2D]/80 mb-6">
                  Our signature streetwear t-shirt featuring bold graphic design. Made with 100% premium cotton
                  for ultimate comfort. Perfect for making a statement while staying comfortable.
                </p>

                <div className="flex justify-center lg:justify-start">
                  <Link href="/shop/67d3e6dce19dc6e5e6dea034">
                    <Button
                      variant="outline"
                      className="border-[#593C2D] font-['Segoe_UI'] text-[#593C2D] hover:bg-[#593C2D] hover:text-white rounded-full px-8"
                    >
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Center Image - Now spans 2 columns on large screens */}
            <div className="reveal delay-2 md:col-span-2 lg:col-span-1">
              <div className="relative max-w-md mx-auto">
                <Image
                  src="/featured-hoodie.jpeg"
                  alt="Street Comfort T-Shirt"
                  width={500}
                  height={500}
                  className="rounded-2xl w-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="reveal delay-3 lg:col-span-1">
              {/* Right Side Details */}
              <div className="p-6 rounded-2xl">
                <div className="mb-6 text-center lg:text-left">
                  <p className="text-[#593C2D] text-3xl font-['Playfair_Display']">₦12,900</p>
                </div>


                <div className="mb-6 font-['Segoe_UI'] text-center lg:text-left">
                  <h3 className="text-[#593C2D] font-['Playfair_Display'] mb-2">Features:</h3>
                  <ul className="space-y-2 inline-block">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#593C2D]"></span>
                      <span className="text-[#593C2D] text-sm">100% Premium Cotton</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#593C2D]"></span>
                      <span className="text-[#593C2D] text-sm">Bold Graphic Design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#593C2D]"></span>
                      <span className="text-[#593C2D] text-sm">Streetwear Style</span>
                    </li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#593C2D]/20 my-6"></div>

                {/* Testimonial */}
                <div className=" max-w-lg mx-auto text-center lg:text-left">
                  <p className="text-[#593C2D] font-['Segoe_UI'] italic text-sm mb-4">
                    "The design is fire! The material quality is amazing and the fit is perfect. Street Comfort never disappoints!"
                  </p>
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <Image
                      src="/featured-hoodie.jpeg"
                      alt="Tosin"
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <div>
                      <h4 className="text-[#593C2D] font-['Playfair_Display'] text-sm">Tosin</h4>
                      <p className="text-[#593C2D]/60 text-xs">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 