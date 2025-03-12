import { NextRequest, NextResponse } from 'next/server'
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
    const blogId = request.nextUrl.pathname.split('/').pop()
    
    if (!blogId) {
        return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    try {
        const client = await clientPromise
        const db = client.db()
        
        const blog = await db.collection("blogs").findOne({
            _id: new ObjectId(blogId)
        })
        
        if (!blog) {
            return NextResponse.json(
                { message: "Blog not found" },
                { status: 404 }
            )
        }
        
        return NextResponse.json(blog)
    } catch (error) {
        console.error('[BLOG_GET]', error)
        return NextResponse.json(
            { message: "Failed to fetch blog post" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    const blogId = request.nextUrl.pathname.split('/').pop()
    
    if (!blogId) {
        return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    try {
        // Your blog deletion logic here
        return NextResponse.json({ message: "Blog deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    const blogId = request.nextUrl.pathname.split('/').pop()
    
    if (!blogId) {
        return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    try {
        const body = await request.json()
        // Your blog update logic here
        return NextResponse.json({ message: "Blog updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
    }
} 