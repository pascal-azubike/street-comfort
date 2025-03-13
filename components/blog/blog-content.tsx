"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  category: string
  content: string
  readTime: string
}

interface BlogContentProps {
  variant?: 'home' | 'page'
  posts?: BlogPost[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Rise of Adire in Modern Nigerian Fashion",
    excerpt: "How traditional tie-dye fabric is revolutionizing contemporary Nigerian fashion and making waves globally.",
    date: "March 15, 2024",
    image: "/blog-1.jpg",
    category: "Fashion Trends",
    readTime: "8 min",
    content: `
      <h2>The Renaissance of Adire</h2>
      <p>In the heart of Nigeria's fashion revolution, Adire, the traditional Yoruba tie-dye textile, has emerged as a powerful symbol of cultural pride and contemporary style. This resurgence isn't just a passing trend – it's a movement that's capturing the attention of fashion enthusiasts worldwide.</p>

      <h3>From Local Markets to International Runways</h3>
      <p>Traditional Adire makers in cities like Abeokuta are seeing unprecedented demand for their craftsmanship. Major fashion houses are incorporating Adire patterns into their collections, while Nigerian designers like Lisa Folawiyo and Maki Oh are creating innovative pieces that blend traditional techniques with modern silhouettes.</p>

      <h3>Celebrity Influence</h3>
      <p>Nigerian celebrities and influencers have played a crucial role in popularizing Adire. From Tiwa Savage's music video outfits to Chimamanda Ngozi Adichie's public appearances in Adire designs, these cultural ambassadors have helped position the fabric as a luxury fashion statement.</p>

      <h2>Modern Interpretations</h2>
      <p>Today's Adire goes beyond traditional wrapper styles. Young designers are creating:</p>
      <ul>
        <li>Corporate wear with subtle Adire patterns</li>
        <li>Athleisure collections featuring Adire prints</li>
        <li>Evening wear that combines Adire with contemporary cuts</li>
        <li>Accessories and footwear with Adire accents</li>
      </ul>

      <h2>Sustainability and Economic Impact</h2>
      <p>The Adire revival has created economic opportunities for local artisans and contributed to sustainable fashion practices. Many young Nigerians are learning the craft, ensuring this cultural heritage continues while providing employment opportunities.</p>

      <h2>Looking Ahead</h2>
      <p>As we see Adire's influence growing in the global fashion scene, it's clear that this is more than just a trend. It's a celebration of Nigerian creativity and craftsmanship, proving that traditional techniques have a place in modern fashion.</p>
    `
  },
  {
    id: 2,
    title: "The New Wave of Sustainable Fashion in Nigeria",
    excerpt: "How Nigerian designers are leading the eco-friendly fashion movement in Africa.",
    date: "March 10, 2024",
    image: "/blog-2.jpg",
    category: "Sustainable Fashion",
    readTime: "6 min",
    content: `
      <h2>Nigeria's Green Fashion Revolution</h2>
      <p>In the heart of Lagos, a new movement is taking shape as Nigerian designers embrace sustainable fashion practices. From upcycled materials to eco-friendly production methods, the industry is witnessing a significant shift towards environmental consciousness.</p>

      <h3>Local Materials, Global Impact</h3>
      <p>Nigerian designers are increasingly turning to locally sourced, sustainable materials such as organic cotton from northern Nigeria, recycled textiles from Lagos markets, and natural dyes from indigenous plants. This shift not only reduces environmental impact but also supports local communities.</p>

      <h2>Leading Sustainable Brands</h2>
      <ul>
        <li>Lagos Space Programme - Known for zero-waste pattern cutting</li>
        <li>This Is Us - Specializing in upcycled denim collections</li>
        <li>Emmy Kasbit - Using akwete cloth with sustainable practices</li>
      </ul>

      <h2>Consumer Awareness</h2>
      <p>Young Nigerian consumers are becoming more conscious of their fashion choices. The rise of thrifting culture, locally known as "okrika," has transformed from a necessity to a trendy, sustainable choice among fashion-forward youth.</p>

      <h2>Future Prospects</h2>
      <p>With growing international recognition and local support, Nigeria's sustainable fashion movement is set to influence the global fashion industry, proving that style and sustainability can coexist beautifully.</p>
    `
  },
  {
    id: 3,
    title: "Street Style Revolution: Lagos Fashion Week 2024",
    excerpt: "How Lagos street style is reshaping African fashion narratives and influencing global trends.",
    date: "March 5, 2024",
    image: "/blog-3.jpg",
    category: "Street Style",
    readTime: "7 min",
    content: `
      <h2>Lagos: Africa's Fashion Capital</h2>
      <p>The streets of Lagos have become a runway of their own, showcasing a bold mix of traditional and contemporary styles. From Alara to Victoria Island, fashion enthusiasts are breaking rules and setting new trends.</p>

      <h3>The New Street Style Stars</h3>
      <p>Instagram influencers and street style photographers are documenting the evolution of Lagos fashion, capturing the perfect blend of western influences with traditional Nigerian elements.</p>

      <h2>Trending Styles</h2>
      <ul>
        <li>Deconstructed traditional wear</li>
        <li>Bold color blocking with African prints</li>
        <li>High-end streetwear with local elements</li>
        <li>Gender-fluid Nigerian fashion</li>
      </ul>

      <h2>Global Recognition</h2>
      <p>International fashion magazines and platforms are turning their attention to Lagos street style, recognizing it as a major influence in global fashion trends.</p>
    `
  },
  {
    id: 4,
    title: "The Evolution of Nigerian Wedding Fashion",
    excerpt: "Modern interpretations of traditional Nigerian wedding attire are setting new standards in celebration wear.",
    date: "February 28, 2024",
    image: "/33.jpg",
    category: "Wedding Fashion",
    readTime: "9 min",
    content: `
      <h2>The Modern Nigerian Wedding</h2>
      <p>Nigerian weddings have always been known for their grandeur, but 2024 is seeing a remarkable evolution in wedding fashion. Couples are finding innovative ways to honor tradition while embracing contemporary style.</p>

      <h3>Trending Wedding Styles</h3>
      <ul>
        <li>Contemporary aso-oke designs</li>
        <li>Minimalist traditional attire</li>
        <li>Fusion wedding dresses</li>
        <li>Modern gele styling</li>
      </ul>

      <h2>Designer Innovations</h2>
      <p>Leading Nigerian designers are reimagining traditional wedding attire with modern silhouettes, sustainable materials, and versatile designs that can be worn after the wedding.</p>

      <h2>The Future of Wedding Fashion</h2>
      <p>As Nigerian weddings continue to evolve, we're seeing a beautiful balance of cultural pride and contemporary fashion sensibilities, setting trends for celebrations worldwide.</p>
    `
  },
  {
    id: 5,
    title: "Accessorizing the Nigerian Way: The New Rules",
    excerpt: "From traditional beads to modern statements, how Nigerian accessories are making global waves.",
    date: "February 20, 2024",
    image: "/bigImage.jpeg",
    category: "Accessories",
    readTime: "5 min",
    content: `
      <h2>The Power of Nigerian Accessories</h2>
      <p>Nigerian accessories have evolved from traditional symbols to powerful fashion statements. From coral beads to contemporary pieces, these accessories tell stories of heritage and modern style.</p>

      <h3>Current Trends</h3>
      <ul>
        <li>Modern interpretations of coral beads</li>
        <li>Mixed metal statement pieces</li>
        <li>Contemporary gele accessories</li>
        <li>Sustainable jewelry options</li>
      </ul>

      <h2>Styling Tips</h2>
      <p>Learn how to mix traditional pieces with modern outfits, creating unique looks that respect heritage while embracing contemporary fashion.</p>

      <h2>Investment Pieces</h2>
      <p>Guide to collecting and investing in Nigerian accessories, from traditional coral beads to contemporary designer pieces.</p>
    `
  },
  {
    id: 6,
    title: "Street Comfort: Beautiful In Every Way",
    excerpt: "Discover how Street Comfort is revolutionizing Nigerian streetwear with authentic designs and premium quality.",
    date: "March 20, 2024",
    image: "/street-cap.jpeg",
    category: "Street Fashion",
    readTime: "8 min",
    content: `
      <h2>The Street Comfort Revolution</h2>
      <p>Street Comfort stands at the intersection of Nigerian cultural heritage and contemporary street fashion, creating a unique narrative in the global streetwear scene. Founded in Lagos, this revolutionary brand has become more than just a clothing line – it's a movement celebrating authenticity, comfort, and cultural pride.</p>

      <h3>The Street Comfort Philosophy</h3>
      <p>At its core, Street Comfort believes in three fundamental principles: authentic Nigerian design elements, premium quality materials, and contemporary street culture integration.</p>

      <h2>Our Collections</h2>
      <h3>The Urban Heritage Line</h3>
      <p>Our flagship collection features premium streetwear pieces that blend traditional Nigerian patterns with modern silhouettes. Each piece is crafted from high-quality, sustainable materials, ensuring both comfort and durability.</p>
      
      <ul>
        <li>Premium Cotton Hoodies with Adire Patterns</li>
        <li>Street-Smart Cargo Pants with Traditional Motifs</li>
        <li>Limited Edition Graphic Tees featuring Nigerian Art</li>
        <li>Custom-Designed Sneakers with Local Artwork</li>
      </ul>

      <h2>Quality and Community Impact</h2>
      <p>Every Street Comfort piece undergoes rigorous quality control while maintaining our commitment to community development through youth empowerment programs and local artist collaborations.</p>

      <h2>The Future of Street Fashion</h2>
      <p>As we continue to grow, Street Comfort remains dedicated to expanding sustainable practices, introducing innovative designs, and representing Nigerian culture globally. Visit our flagship store in Lagos to experience the perfect blend of comfort, style, and cultural pride.</p>
    `
  }
]

export function BlogContent({ variant = 'page', posts = blogPosts }: BlogContentProps) {
  const displayPosts = variant === 'home' ? posts.slice(0, 3) : posts

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayPosts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="group"
        >
          <article className="bg-[#FDF7F5] rounded-2xl p-4 hover:shadow-lg transition-all duration-300 h-[600px] flex flex-col">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow space-y-4 pt-6">
              <h3 className="text-2xl font-['Playfair_Display'] text-[#593C2D]">
                {post.title}
              </h3>

              <p className="text-[#593C2D]/60 text-sm font-['Segoe_UI'] line-clamp-2">
                {post.excerpt}
              </p>

              <div className="mt-auto">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-[#B68C66] text-[#B68C66] hover:bg-[#B68C66] hover:text-white font-['Segoe_UI']"
                >
                  Learn more
                </Button>
              </div>
            </div>
          </article>
        </Link>
      ))}

      {variant === 'home' && (
        <div className="lg:col-span-3 flex justify-center mt-8">
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 border-[#B68C66] text-[#B68C66] hover:bg-[#B68C66] hover:text-white"
          >
            <Link href="/blog" className="flex items-center gap-2">
              View All Posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
} 