"use client"

import Image from "next/image"
import { blogPosts } from "@/components/blog/blog-content"
import { useParams } from "next/navigation"
import { PageHero } from "../../pageHero"

export default function BlogPost() {
    const params = useParams()
    const post = blogPosts.find(post => post.id.toString() === params.blogId)

    if (!post) {
        return <div>Post not found</div>
    }

    return (
        <div>
            <PageHero
                title={post.title}
                description={post.excerpt}
            />

            <article className="max-w-4xl mx-auto px-4 py-16">
                {/* Author and Meta Info */}
                <div className="flex items-center mb-8">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                            src={'/authors/folake.jpg'}
                            alt={'Folake Adebayo'}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="ml-4">
                        <p className="text-[#593C2D] font-medium">{'Folake Adebayo'}</p>
                        <div className="flex items-center text-sm text-[#593C2D]/60">
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime} read</span>
                        </div>
                    </div>
                </div>

                {/* Main Image */}
                <div className="relative aspect-[16/9] mb-12 rounded-2xl overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-['Playfair_Display'] prose-headings:text-[#593C2D] prose-p:text-[#593C2D]/80">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            </article>
        </div>
    )
} 