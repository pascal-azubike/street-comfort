"use client"
console.log('im inside shop page')

import { PageHero } from "../pageHero";
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import Image from "next/image"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BlogPost {
    _id: string
    title: string
    excerpt: string
    coverImage: string
    category: string
    author: {
        name: string
        image: string
    }
    createdAt: string
}

async function fetchBlogPosts({ cursor = "" }) {
    try {
        const res = await fetch(`/api/blog?cursor=${cursor}`)

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("Blog posts not found")
            }
            if (res.status === 429) {
                throw new Error("Rate limit exceeded. Please try again later.")
            }
            throw new Error("Failed to fetch blog posts")
        }

        const data = await res.json()

        if (!data.items || !Array.isArray(data.items)) {
            throw new Error("Invalid response format")
        }

        return data
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Re-throw to be handled by React Query
    }
}

export default function Blog() {
    const { ref, inView } = useInView()

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isError,
        refetch,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['blog-posts'],
        queryFn: ({ pageParam }) => fetchBlogPosts({ cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: "",
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage().catch(console.error)
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center py-20">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#593C2D] mx-auto mb-4" />
                        <p className="text-[#593C2D]/60">Loading blog posts...</p>
                    </div>
                </div>
            )
        }
        console.log(isError)
        if (isError) {

            return (
                <div className="flex justify-center py-20">
                    <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-xl">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-900 mb-2">
                            Error Loading Blog Posts
                        </h3>
                        <p className="text-red-500 mb-4">
                            {error instanceof Error ? error.message : "Failed to load blog posts"}
                        </p>
                        <Button
                            onClick={() => refetch()}
                            className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            )
        }

        if (!data?.pages[0]?.items.length) {
            return (
                <div className="flex justify-center py-20">
                    <div className="text-center max-w-md mx-auto p-6 bg-[#FDF7F5] rounded-xl">
                        <AlertCircle className="h-8 w-8 text-[#593C2D] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#593C2D] mb-2">
                            No Blog Posts Found
                        </h3>
                        <p className="text-[#593C2D]/60 mb-4">
                            There are currently no blog posts available.
                        </p>
                    </div>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.pages.map((page) =>
                    page.items.map((post: BlogPost) => (
                        <Link
                            key={post._id}
                            href={`/blog/${post._id}`}
                            className="group"
                        >
                            <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        placeholder="blur"
                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = '/blog-placeholder.jpg'
                                        }}
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
                                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                            <Image
                                                src={post.author?.image}
                                                alt={post.author?.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-[#593C2D]">
                                                {post.author?.name}
                                            </p>
                                            <p className="text-xs text-[#593C2D]/60">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))
                )}
            </div>
        )
    }

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
                    {renderContent()}

                    {hasNextPage && !isError && (
                        <div
                            ref={ref}
                            className="mt-8 flex justify-center"
                        >
                            {isFetchingNextPage && (
                                <Loader2 className="h-6 w-6 animate-spin text-[#593C2D]" />
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

// Image blur placeholder helpers
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3e6dc" offset="20%" />
      <stop stop-color="#fdf7f5" offset="50%" />
      <stop stop-color="#f3e6dc" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3e6dc" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str) 