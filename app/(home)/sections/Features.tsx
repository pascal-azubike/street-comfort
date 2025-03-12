"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useReveal } from "@/hooks/useReveal"
import { useState, useRef, MouseEvent } from "react"

interface FeatureProps {
  icon: string
  title: string
  description: string
  className?: string
}

const useTiltEffect = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 20;
    const tiltY = (centerX - x) / 20;
    
    setTilt({ x: tiltX, y: tiltY });
  };
  
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };
  
  return { tilt, handleMouseMove, handleMouseLeave };
};

export function Feature({ icon, title, description, className = "" }: FeatureProps) {
  const { tilt, handleMouseMove, handleMouseLeave } = useTiltEffect();

  return (
    <div className={`flex flex-col items-center text-center py-8 first:pt-0 last:pb-0 lg:py-0 px-6 ${className}`}>
      <div 
        className="w-10 h-10 mb-3 bg-[#EBDBC2] rounded-full p-1.5 transition-transform duration-200 ease-out"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <Image
          src={icon}
          alt={title}
          width={40}
          height={40}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-[#593C2D] text-[18px] font-medium font-['Playfair_Display'] mb-1.5">
        {title}
      </h3>
      <p className="font-['Segoe_UI'] text-[#593C2D]/60 text-[12px] max-w-[480px] mx-auto font-normal">
        {description}
      </p>
    </div>
  )
}

export default function Features() {
  const revealRef = useReveal()
  return (
    <section className="container mx-auto" ref={revealRef}>
      <div className="">
        {/* Features Grid */}
        <div className="bg-[#F7F1EA] backdrop-blur-sm p-7">
          <div className="grid reveal delay-1 grid-cols-1 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-y md:divide-y-0 divide-[#EBDBC2]">
            <Feature
              icon="/freeShipping.png"
              title="Free Shipping"
              description="Fast and reliable delivery across Nigeria for all your street style needs."
            />
            <Feature
              icon="/exclusiveDesign.png"
              title="Exclusive Design"
              description="Unique streetwear pieces that blend urban culture with modern style."
              className="md:border-l border-[#EBDBC2] lg:border-l-0"
            />
            <Feature
              icon="/goodPackaging.png"
              title="Premium Packaging"
              description="Secure and stylish packaging ensuring your items arrive in perfect condition."
            />
            <Feature
              icon="/highestQuality.png"
              title="Superior Quality"
              description="Carefully selected materials for comfort and lasting durability."
              className="md:border-l border-[#EBDBC2] lg:border-l-0"
            />
          </div>
        </div>

        {/* The Art Of Radiant Refinement Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center mt-16 max-w-5xl mx-auto container">
          {/* Left Image */}
          <div className="relative flex justify-center md:justify-start">
            <div className="bg-white reveal delay-2 rounded-2xl p-2 shadow-inner">
              <Image
                src="/bigImage.jpeg"
                alt="Street Style Fashion"
                width={400}
                height={500}
                className="rounded-xl"
              />
              <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-[#FFB800]">★</span>
                  ))}
                </div>
                <span className="text-[#593C2D] text-sm">(5/5)</span>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-1 text-center md:text-left">
            <h2 className="text-[#593C2D] text-4xl font-['Playfair_Display'] mb-6">
              Street Culture Meets Modern Fashion
            </h2>
            <p className="reveal delay-2 text-[#593C2D]/60 font-['Segoe_UI'] mb-8 text-sm">
              Experience the fusion of Nigerian street culture and contemporary fashion. Our designs celebrate the vibrant spirit of Lagos while delivering unmatched comfort and style for the bold and authentic.
            </p>
            <div className="flex justify-center md:justify-start">
              <Button
                variant="outline"
                className="reveal delay-3 border-[#593C2D] text-[#593C2D] hover:bg-[#593C2D] hover:text-white rounded-full px-8 py-2"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden reveal delay-2 lg:flex justify-end items-end">
            <Image
              src="/smallImage.jpeg"
              alt="Street Style Detail"
              width={400}
              height={400}
              className="rounded-2xl lg:w-[200px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 