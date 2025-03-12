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
}

interface BlogContentProps {
  variant?: 'home' | 'page'
  posts?: BlogPost[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Jewelry Making",
    excerpt: "Discover the intricate process behind creating handcrafted jewelry pieces.",
    date: "March 15, 2024",
    image: "/blog-1.jpg",
    category: "Craftsmanship",

  },
  {
    id: 2,
    title: "Trending Jewelry Styles in 2024",
    excerpt: "Stay up to date with the latest jewelry trends and fashion statements.",
    date: "March 10, 2024",
    image: "/blog-2.jpg",
    category: "Fashion",

  },
  {
    id: 3,
    title: "Caring for Your Fine Jewelry",
    excerpt: "Learn essential tips for maintaining the beauty of your precious pieces.",
    date: "March 5, 2024",
    image: "/blog-3.jpg",
    category: "Care Guide",

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