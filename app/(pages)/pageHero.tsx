"use client"

import Navbar from "@/components/Navbar"
import Image from "next/image"
import Footer from "../(home)/sections/Footer"
import { QueryProvider } from "../(protected)/components/query-provider"


interface PageHeroProps {
  title: string
  description: string
}

function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="relative h-[70vh] bg-[#FDF7F5]">
      {/* Background Image */}
      <Image
        src="/33.jpg"
        alt="Luxury Jewelry"
        fill
        className="object-cover opacity-90"
        priority
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#462901]/50" />

      {/* Main Glassmorphism Container */}
      <div className="absolute z-[101] inset-0 flex items-center justify-center p-4">
        <div className="bg-white/10 w-[90vw] lg:w-[75vw] backdrop-blur-sm border py-4 border-white/20 rounded-3xl relative ">
          {/* Header */}
          <Navbar />

          {/* Page Title and Description */}
          <div className="text-center text-white mt-20 px-4">
            <h1 className="text-6xl font-['Playfair_Display'] mb-4">{title}</h1>
            <p className="font-['Segoe_UI'] text-white/80 max-w-md mx-auto text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
          <Footer />
      </main>
    </div>
    </QueryProvider>
  )
}

export { PageHero }
