import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// POST request handler
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password} = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 })
  }
}

// Optionally, you can handle other methods like GET, DELETE, etc. if needed
export function GET() {
  return new Response('Method Not Allowed', { status: 405 })
}
