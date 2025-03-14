'use client'

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useReveal } from "@/hooks/useReveal"
import Navbar from "@/components/Navbar"
import { useCountAnimation } from "@/hooks/useCountAnimation"
import Link from "next/link"
import { useState } from "react"
import { ReviewForm } from "../components/review-form"

export default function Hero() {
    const revealRef = useReveal()
    const count = useCountAnimation(230)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

    const handleReviewClick = () => {
        console.log("Review clicked")
        setIsReviewModalOpen(true)
    }

    return (
        <div className="bg-[#462901]">
            {/* Main Content */}
            <section className="relative min-h-screen bg-[#FDF7F5]" ref={revealRef}>
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
                <div className=" pt-12 inset-0 flex items-center justify-center p-4">
                    <div className="bg-white/10 w-[90vw] lg:w-[85vw] backdrop-blur-sm border py-4 border-white/20 rounded-3xl relative ">
                        {/* Header */}
                        <Navbar />

                        {/* Hero Content */}
                        <div className="flex flex-col gap-6 px-4 md:px-8 mt-8 md:mt-12 md:hidden lg:flex">
                            {/* Main Heading */}
                            <h1 className="reveal font-['Playfair_Display'] text-[40px] md:text-[50px] lg:text-[60px] text-white leading-[1.1] font-medium text-center md:text-left">
                                Luxury Fashion<br />Collections
                            </h1>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Text and CTA */}
                                <div className="space-y-6 flex flex-col items-center md:items-start">
                                    <p className="font-sans reveal delay-1 text-sm text-white/80 leading-6 max-w-sm text-center md:text-left">
                                        Street Comfort | Nigeria<br />
                                        Where Nigerian street culture meets modern fashion. Premium streetwear for the bold and authentic.
                                    </p>

                                    <Link href="/shop">
                                        <Button
                                            variant="outline"
                                            className="w-fit reveal delay-2 font-sans text-base leading-[25px] bg-white text-[#5C4434] hover:bg-[#5C4434] hover:text-white px-6 md:px-8 py-4 md:py-6 rounded-full group transition-all duration-300 ease-in-out hover:scale-[1.02]"
                                        >
                                            Let's Get Started
                                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6 flex flex-col items-center md:items-end">
                                    {/* 230K Badge */}
                                    <div className="flex flex-wrap justify-center sm:justify-start reveal lg:justify-end items-center gap-3 lg:-mt-20 max-[380px]:justify-center">
                                        <div className="flex -space-x-2 rounded-full bg-white/20 backdrop-blur-sm py-2 px-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-12 h-12 rounded-full border-[1.5px] border-white overflow-hidden">
                                                    <Image
                                                        src={`/customer-${i}.jpeg`}
                                                        alt={`customer${i}`}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {/* First plus button */}
                                            <button 
                                                onClick={handleReviewClick}
                                                className="w-12 h-12 rounded-full border-[1.5px] bg-white text-[#5C4434] border-white overflow-hidden flex items-center justify-center text-xl transition-all duration-300 hover:bg-[#5C4434] hover:text-white hover:scale-105 hover:shadow-lg transform"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {/* First Happy Clients */}
                                        <div className="flex flex-col items-start max-[380px]:items-center gap-1 min-w-[120px]">
                                            <span className="font-['Playfair_Display'] text-[48px] leading-[53px] text-white font-medium">
                                                {count}K
                                            </span>
                                            <span className="font-sans text-[16px] leading-[24px] text-white font-normal">
                                                Happy Clients
                                            </span>
                                        </div>
                                    </div>

                                    {/* Featured Content */}
                                    <div className="max-w-[280px] md:w-[340px] reveal delay-2">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl">
                                            <div className="flex flex-row md:flex-col lg:flex-row items-center pl-2">
                                                <Image
                                                    src="/street-cap.jpeg"
                                                    alt="Beautiful Jewelry"
                                                    width={280}
                                                    height={180}
                                                    className="w-[100px] h-[100px] md:w-full md:h-[180px] lg:w-[100px] lg:h-[100px] object-cover rounded-l-2xl md:rounded-none md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                                                />
                                                <div className="p-4 text-left md:text-center lg:text-left">
                                                    <h3 className="text-xl font-['Playfair_Display'] text-[#462901] leading-tight mb-2">
                                                        Beautiful In Every Detail
                                                    </h3>
                                                    <div className="flex items-center justify-start md:justify-center lg:justify-start gap-2 text-[#593c2d] group cursor-pointer">
                                                        <Link href="/blog/6" className="font-sans text-base">Read More</Link>
                                                        <ArrowRight size={16} className="stroke-2 group-hover:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medium Screen Content */}
                        <div className="hidden md:flex lg:hidden justify-between gap-6 px-4 md:px-8 mt-8 md:mt-12">
                            <div className=" ">
                                {/* Main Heading */}
                                <h1 className="font-['Playfair_Display'] text-[40px] md:text-[55px] lg:text-[70px] text-white leading-[1.1] font-medium text-center md:text-left">
                                Luxury Fashion<br />Collections
                                </h1>
                                {/* Content Grid */}
                                <div className="">
                                    {/* Left Column - Text and CTA */}
                                    <div className="space-y-6 flex flex-col items-center md:items-start">
                                        <p className="font-sans text-sm text-white/80 leading-6 max-w-[300px] text-center md:text-left">
                                            Street Comfort | Lagos, Nigeria<br />
                                            Where Nigerian street culture meets modern fashion. Premium streetwear for the bold and authentic.
                                        </p>

                                        <Link href="/shop">
                                            <Button
                                                variant="outline"
                                                className="w-fit font-sans text-base leading-[25px] bg-white text-[#5C4434] hover:bg-[#5C4434] hover:text-white px-6 md:px-8 py-4 md:py-6 rounded-full group transition-all duration-300 ease-in-out hover:scale-[1.02]"
                                            >
                                                Let's Get Started
                                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6 flex flex-col items-center md:items-end  ">
                                {/* 230K Badge */}
                                <div className="flex flex-wrap justify-center sm:justify-start reveal lg:justify-end items-center gap-3 lg:-mt-20 max-[380px]:justify-center">
                                    <div className="flex -space-x-2 rounded-full bg-white/20 backdrop-blur-sm py-2 px-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-[1.5px] border-white overflow-hidden">
                                                <Image
                                                    src={`/customer-${i}.jpeg`}
                                                    alt={`customer${i}`}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {/* Second plus button */}
                                        <button 
                                            onClick={handleReviewClick}
                                            className="w-12 h-12 rounded-full border-[1.5px] bg-white text-[#5C4434] border-white overflow-hidden flex items-center justify-center text-xl transition-all duration-300 hover:bg-[#5C4434] hover:text-white hover:scale-105 hover:shadow-lg transform"
                                        >
                                            +
                                        </button>
                                    </div>
                                    {/* Second Happy Clients */}
                                    <div className="flex flex-col items-start max-[380px]:items-center gap-1">
                                        <span className="font-['Playfair_Display'] text-[48px] leading-[53px] text-white font-medium">
                                            {count}K
                                        </span>
                                        <span className="font-sans text-[16px] leading-[24px] text-white font-normal">
                                            Happy Clients
                                        </span>
                                    </div>
                                </div>

                                {/* Featured Content */}
                                <div className="w-[240px] ">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl">
                                        <div className="flex flex-row md:flex-col lg:flex-row">
                                            <Image
                                                src="/street-cap.jpeg"
                                                alt="Beautiful Jewelry"
                                                width={280}
                                                height={180}
                                                className=" h-[120px] w-full  object-cover rounded-l-2xl md:rounded-none md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                                            />
                                            <div className="p-4 text-left md:text-center lg:text-left">
                                                <h3 className="text-xl font-['Playfair_Display'] text-[#462901] leading-tight mb-2">
                                                    Beautiful In Every Detail
                                                </h3>
                                                <div className="flex items-center justify-start md:justify-center lg:justify-start gap-2 text-[#593c2d] group cursor-pointer">
                                                    <Link href="/blog/6" className="font-sans text-base">Read More</Link>
                                                    <ArrowRight size={16} className="stroke-2 group-hover:translate-x-1 transition-transform duration-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ReviewForm 
                isOpen={isReviewModalOpen} 
                onClose={() => setIsReviewModalOpen(false)} 
            />
        </div>
    )
}
