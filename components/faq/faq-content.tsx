"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FAQItem {
  question: string
  answer: string
  category?: string
  bgColor?: string
}

interface FAQContentProps {
  variant?: 'home' | 'page'
  faqs?: FAQItem[]
  showLearnMore?: boolean
}

export const faqItems: FAQItem[] = [
  {
    question: "What sizes do you offer?",
    answer: "We offer sizes XS to XL in most of our clothing items. You can find detailed measurements in our size guide to ensure the perfect fit. If you're unsure about sizing, our customer service team is happy to help!",
    category: "Sizing",
    bgColor: "bg-[#FDF7F5]"
  },
  {
    question: "How long does delivery take?",
    answer: "For orders within Lagos, delivery typically takes 1-3 business days. For other locations in Nigeria, delivery takes 3-7 business days. You'll receive a tracking number once your order ships.",
    category: "Shipping",
    bgColor: "bg-[#F3E6DC]"
  },
  {
    question: "What's your return policy?",
    answer: "We offer a 7-day return policy for unworn items in their original packaging. Please note that customized items cannot be returned unless defective. Contact our customer service for return authorization.",
    category: "Returns",
    bgColor: "bg-[#F3E6DC]"
  },
  {
    question: "Do you ship nationwide?",
    answer: "Yes, we offer nationwide shipping across Nigeria. Shipping fees vary by location, and we partner with reliable logistics companies to ensure safe delivery of your items.",
    category: "Shipping",
    bgColor: "bg-[#F3E6DC]"
  },
  {
    question: "How do I care for my Street Comfort clothing?",
    answer: "We recommend washing our clothes in cold water and hanging them to dry. Each item comes with specific care instructions on the label. For graphic tees and prints, turn them inside out before washing.",
    category: "Care",
    bgColor: "bg-[#F3E6DC]"
  },
  {
    question: "Can I modify or cancel my order?",
    answer: "Orders can be modified or cancelled within 1 hour of placement. After this window, we begin processing orders for shipment. Contact our customer service immediately if you need to make changes.",
    category: "Orders",
    bgColor: "bg-[#F3E6DC]"
  }
]

export function FAQContent({ variant = 'page', faqs = faqItems, showLearnMore = false }: FAQContentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const displayFaqs = variant === 'home' ? faqs.slice(0, 3) : faqs

  return (
    <div className="grid container mx-auto grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left Content - Only show in home variant */}
      {variant === 'home' && (
        <div>
          <h2 className="text-[#593C2D] text-center md:text-left  text-4xl font-['Playfair_Display'] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-['Segoe_UI'] text-center md:text-left max-w-sm mx-auto text-[14px] leading-[26px] text-[#593C2D]/80 mb-6">
            Got questions about our products, delivery, or services? 
            Find quick answers to our most commonly asked questions.
          </p>
          {showLearnMore && (
            <Link href="/faq">
              <Button 
                variant="outline" 
                className="border-[#593C2D] text-[#593C2D] hover:bg-[#593C2D] hover:text-white rounded-full px-8"
              >
                View All FAQs
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Right Content / Full Width if not home */}
      <div className={variant === 'home' ? '' : 'lg:col-span-2'}>
        <div className="space-y-4 font-['Segoe_UI']">
          {displayFaqs.map((faq, index) => (
            <div key={index} className="border-none">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={cn(
                  "w-full flex items-center justify-between rounded-xl px-6 py-4 text-[#593C2D] font-['Playfair_Display'] hover:no-underline",
                  faq.bgColor || "bg-[#F3E6DC]"
                )}
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )} 
                />
              </button>
              
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="px-6 pt-2 text-[#593C2D]/80 font-['Segoe_UI'] text-[14px] leading-[26px]">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 