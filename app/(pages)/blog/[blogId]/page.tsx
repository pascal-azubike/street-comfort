"use client"

import Image from "next/image"
import { blogPosts } from "@/components/blog/blog-content"
import { useParams } from "next/navigation"
import { PageHero } from "../../pageHero"
import { JsonLd } from 'react-schemaorg'
import type { BlogPosting, WithContext } from 'schema-dts'
// import { generateMetadata } from '@/lib/metadata'
import { Metadata } from 'next'

interface Props {
    params: { blogId: string }
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//     const post = blogPosts.find(post => post.id.toString() === params.blogId)
    
//     if (!post) {
//         return generateMetadata({
//             title: 'Blog Post Not Found',
//             description: 'The requested blog post could not be found.',
//             noIndex: true,
//             pathname: `/blog/${params.blogId}`,
//         })
//     }

//     return generateMetadata({
//         title: post.title,
//         description: post.excerpt,
//         image: post.image,
//         pathname: `/blog/${params.blogId}`,
//     })
// }

export default function BlogPost() {
    const params = useParams()
    const post = blogPosts.find(post => post.id.toString() === params.blogId)

    if (!post) {
        return <div>Post not found</div>
    }

    const blogStructuredData: WithContext<BlogPosting> = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.image,
        datePublished: post.date,
        publisher: {
            '@type': 'Organization',
            name: 'Street Comfort',
            logo: {
                '@type': 'ImageObject',
                url: '/logo.png'
            }
        }
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

            <JsonLd<WithContext<BlogPosting>> item={blogStructuredData} />
        </div>
    )
} 