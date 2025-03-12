import Features from "@/app/(home)/sections/Features";
import Hero from "@/app/(home)/sections/Hero";
import Collections from "@/app/(home)/sections/Collections"
import ChooseType from "@/app/(home)/sections/ChooseType"
import LogoCloud from "@/app/(home)/sections/LogoCloud"
import Reviews from "@/app/(home)/sections/Reviews"
import ProductFeature from "@/app/(home)/sections/ProductFeature"
import FAQ from "@/app/(home)/sections/FAQ"
import Blog from "@/app/(home)/sections/Blog"
import Footer from "@/app/(home)/sections/Footer"


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
    </main>
  )
}