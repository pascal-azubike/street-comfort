import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  
  if (!session?.user) {
    return new NextResponse(
      JSON.stringify({ error: 'Not authenticated' }), 
      { status: 401 }
    )
  }

  return NextResponse.json({
    name: session.user.name,
    email: session.user.email,
  })
}

export async function PUT(request: Request) {
  const session = await auth()
  
  if (!session?.user) {
    return new NextResponse(
      JSON.stringify({ error: 'Not authenticated' }), 
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    // Here you would update the user profile in your database
    // For now, we'll just return the data
    return NextResponse.json(body)
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update profile' }), 
      { status: 500 }
    )
  }
} 