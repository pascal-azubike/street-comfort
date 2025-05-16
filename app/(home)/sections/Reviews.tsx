'use client'

import Image from "next/image"
import { useReveal } from "@/hooks/useReveal"

interface TestimonialCardProps {
  content: string
  title: string
  name: string
  location: string
  image: string
}

function TestimonialCard({ content, title, name, location, image }: TestimonialCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-[#FDF7F5] p-8 rounded-2xl mb-8 w-full">
        <p className="font-['Segoe_UI'] text-[14px] leading-[26px] text-[#593C2D]/80 mb-4">
          {content}
        </p>
        <h3 className="text-[#593C2D] text-lg font-['Playfair_Display']">
          {title}
        </h3>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#593C2D]/10">
          <Image
            src={image}
            alt={name}
            width={304}
            height={304}
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="text-[#593C2D] font-['Playfair_Display'] text-lg mb-1">{name}</h4>
        <p className="text-[#593C2D]/60 font-['Segoe_UI'] text-sm">{location}</p>
      </div>
    </div>
  )
}

export default function Reviews() {
  const revealRef = useReveal()

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-[#FDF7F5]" ref={revealRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <h2 className="text-[#593C2D] text-4xl font-['Playfair_Display'] mb-4">
            What Our Customers Say
          </h2>
          <p className="font-['Segoe_UI'] text-[14px] leading-[26px] text-[#593C2D]/60 max-w-2xl mx-auto">
            Discover what our satisfied customers have to say about their shopping experience. 
            From quality fashion to excellent service, we take pride in delivering the best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="reveal delay-1">
            <TestimonialCard
              content="The quality of these clothes is exceptional! I ordered a complete set and the fit is perfect. The attention to detail and craftsmanship is remarkable. Highly recommended!"
              title="Premium Quality"
              name="Tife Williams"
              location="Yaba, Lagos"
              image="/customer-1.jpeg"
            />
          </div>
          <div className="reveal delay-2">
            <TestimonialCard
              content="These people sabi customer service sha! I been get wahala with my size but them help me sort am quick-quick. The delivery fast no be here. Na confirmed plug!"
              title="Sharp Delivery"
              name="Bayo (Street King)"
              location="Lekki, Lagos"
              image="/customer-2.jpeg"
            />
          </div>
          <div className="reveal delay-3">
            <TestimonialCard
              content="Excellent value for money. The designs are contemporary and the quality is consistent. Their attention to customer satisfaction is impressive. Will definitely be a repeat customer."
              title="Great Value"
              name="Amaka Peters"
              location="Festac, Lagos"
              image="/customer-3.jpeg"
            />
          </div>
          <div className="reveal delay-3">
            <TestimonialCard
              content="My guy! The material wey dem dey use na original. I don buy like 4 shirts from them, no color don fade, no thread don pull. Plus their size chart accurate die!"
              title="Premium Quality"
              name="Debo (Area Father)"
              location="Surulere, Lagos"
              image="/customer-4.jpeg"
            />
          </div>
          <div className="reveal delay-3">
            <TestimonialCard
              content="I was initially skeptical about ordering online, but the experience exceeded my expectations. The quality is outstanding, and their size guide is very accurate. Even convinced my family to shop here!"
              title="Trust Worthy"
              name="Chisom Adebayo"
              location="Ikeja, Lagos"
              image="/customer-5.jpeg"
            />
          </div>
          <div className="reveal delay-3">
            <TestimonialCard
              content="As I rock their complete set for my birthday shoot ehn, everybody for Instagram dey ask me plug. The material soft, design clean, packaging premium. Una too much!"
              title="Trendy Designs"
              name="Tosin (Big Boy)"
              location="VI, Lagos"
              image="/customer-6.jpeg"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 