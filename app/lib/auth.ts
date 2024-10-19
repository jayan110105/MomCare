import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { SessionStrategy } from 'next-auth'

// Initialize Prisma Client
const prisma = new PrismaClient()

export const NEXT_AUTH_CONFIG = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'example@example.com' },
        password: { label: 'Password', type: 'password', placeholder: 'Your password' },
      },
      async authorize(credentials: any) {
        // Find the user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        // If no user found or passwords don't match, return null
        if (!user) {
          throw new Error('Invalid email')
        }
        if(!(await bcrypt.compare(credentials.password, user.password)))
        {
          throw new Error('Invalid password')
        }

        // Return the user object without the password field
        console.log("Success");
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),  // Use PrismaAdapter for session management
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.uid = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.uid
      }
      return session
    },
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  pages: {
    signIn: '/auth',
  }
}
