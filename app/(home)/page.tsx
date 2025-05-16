import { generateMetadata } from "@/app/lib/metadata"
import Hero from "./sections/Hero"
import Features from "./sections/Features"
import Collections from "./sections/Collections"
import ChooseType from "./sections/ChooseType"
import LogoCloud from "./sections/LogoCloud"
import Reviews from "./sections/Reviews"
import ProductFeature from "./sections/ProductFeature"
import FAQ from "./sections/FAQ"
import Blog from "./sections/Blog"
import Footer from "@/components/Footer"
import { MessageCircle } from "lucide-react"




export const metadata = generateMetadata({
  pathname: '/',
  description: "Experience authentic Nigerian streetwear featuring premium quality hoodies, t-shirts, and urban fashion. Shop our exclusive collection of street-style clothing that blends Nigerian culture with modern design.",
})

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Collections />
      <ChooseType />
      <LogoCloud />
      <Reviews />
      <ProductFeature />
      <FAQ />
      <Blog />
      <Footer />
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/2347035226775" // Updated WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </main>
  )
}