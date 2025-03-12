'use client'
import { BlogContent } from "@/components/blog/blog-content"

export default function Blog() {
  return (
    <section className="py-20  max-w-6xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] text-[#593C2D] mb-4">
            Latest From Our Blog
          </h2>
          <p className="text-[#593C2D]/60">
            Stay updated with our latest news and insights.
          </p>
        </div>

        <BlogContent variant="home" />
      </div>
    </section>
  )
} 