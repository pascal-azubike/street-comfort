"use client"

import { PageHero } from "@/app/(pages)/pageHero"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { BubbleToolbar } from "./components/BubbleToolbar"

export default function CreateBlog() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [blogData, setBlogData] = useState({
        title: '',
        excerpt: '',
        category: '',
        coverImage: '',
        readTime: '',
    })

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#593C2D] underline decoration-[#593C2D]/30 hover:decoration-[#593C2D]',
                },
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'paragraph') {
                        return 'Start writing your blog post...'
                    }
                    return ''
                },
                showOnlyCurrent: false,
            }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-4',
            },
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editor?.getHTML()) {
            toast.error('Please add some content to your blog post')
            return
        }
        
        setIsLoading(true)

        try {
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...blogData,
                    content: editor?.getHTML()
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create blog post')
            }

            const data = await response.json()
            toast.success('Blog post created successfully!')
            router.push(`/blog/${data._id}`)
        } catch (error) {
            toast.error('Failed to create blog post')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <PageHero 
                title="Create Blog Post" 
                description="Create a new professional blog post for your website."
            />

            <div className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                placeholder="Blog Title"
                                value={blogData.title}
                                onChange={(e) => setBlogData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                            <Input
                                placeholder="Category"
                                value={blogData.category}
                                onChange={(e) => setBlogData(prev => ({ ...prev, category: e.target.value }))}
                                required
                            />
                        </div>

                        <Input
                            placeholder="Cover Image URL"
                            value={blogData.coverImage}
                            onChange={(e) => setBlogData(prev => ({ ...prev, coverImage: e.target.value }))}
                            required
                        />

                        <Input
                            placeholder="Blog Excerpt"
                            value={blogData.excerpt}
                            onChange={(e) => setBlogData(prev => ({ ...prev, excerpt: e.target.value }))}
                            required
                        />

                        <Input
                            placeholder="Read Time (e.g., '5 min read')"
                            value={blogData.readTime}
                            onChange={(e) => setBlogData(prev => ({ ...prev, readTime: e.target.value }))}
                            required
                        />

                        {/* Rich Text Editor */}
                        <div className="bg-[#FDF7F5] rounded-xl overflow-hidden">
                            {editor && (
                                <BubbleMenu 
                                    editor={editor} 
                                    tippyOptions={{ duration: 100 }}
                                    className="bg-white shadow-lg border border-[#593C2D]/10 rounded-lg overflow-hidden"
                                >
                                    <BubbleToolbar editor={editor} />
                                </BubbleMenu>
                            )}
                            <EditorContent editor={editor} />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-[#593C2D] hover:bg-[#593C2D]/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Blog Post'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
} 