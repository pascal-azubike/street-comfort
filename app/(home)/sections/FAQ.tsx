'use client'

import { FAQContent } from "@/components/faq/faq-content"

export default function FAQ() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-[#FDF7F5]">
      <div className="max-w-6xl mx-auto text-center">
        <FAQContent variant="home" showLearnMore />
      </div>
    </section>
  )
} 