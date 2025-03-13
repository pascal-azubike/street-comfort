import { generateMetadata } from '@/app/lib/metadata'
import { PageHero } from "../pageHero"
import ShopContent from "./components/shop-content"

export const metadata = generateMetadata({
  title: "Shop Nigerian Streetwear | Street Comfort",
  description: "Shop premium Nigerian streetwear, featuring authentic urban fashion, hoodies, and t-shirts. Quality guaranteed with nationwide delivery. Sizes XS-XL available.",
  pathname: '/shop',
})

export default function Shop() {
  return (
    <div>
      <PageHero
        title="Nigerian Fashion Store | Shop Quality Clothing"
        description="Affordable Nigerian streetwear, t-shirts, hoodies & complete sets. Quality guaranteed with nationwide delivery."
      />
      <ShopContent />
    </div>
  )
}
