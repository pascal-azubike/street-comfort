"use client"
console.log('im inside shop page')

import { PageHero } from "../pageHero";
import Image from "next/image"
import Link from "next/link"
import { blogPosts } from "@/components/blog/blog-content"

export default function Blog() {
    return (
        <div>
            <PageHero
                title="Our Blog"
                description="Stay updated with our latest news and insights about jewelry and fashion."
            />

            {/* Blog Intro Section */}
            <section className="py-16 bg-[#FDF7F5]">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#593C2D] mb-4">
                            Discover Our Latest Articles
                        </h2>
                        <p className="text-[#593C2D]/60 font-['Segoe_UI'] leading-relaxed">
                            From styling tips to care guides, explore our collection of articles
                            designed to help you make the most of your jewelry collection. Stay
                            informed about the latest trends and expert advice.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 max-w-6xl mx-auto">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.id}`}
                                className="group"
                            >
                                <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative h-64 w-full">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="text-sm text-[#593C2D]/60 mb-2">
                                            {post.category}
                                        </div>
                                        <h3 className="text-xl font-['Playfair_Display'] text-[#593C2D] mb-2 group-hover:text-[#593C2D]/80 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-[#593C2D]/60 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center mt-4 pt-4 border-t border-[#593C2D]/10">
                                            <p className="text-xs text-[#593C2D]/60">
                                                {post.date} • {post.readTime} read
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
} 