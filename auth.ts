import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from "@/auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null
                
                // console.log("Auth attempt for:", credentials.email)
                
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if(!user){
                    // console.log("Auth failed: User not found")
                    throw new Error ("USER_NOT_FOUND")
                }

                // console.log("User found, emailVerified:", user.emailVerified)

                if (!user.emailVerified) {
                    console.log("Auth failed: Email not verified")
                    throw new Error ("EMAIL_NOT_VERIFIED")
                }

                const valid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!valid) {
                    // console.log("Auth failed: Invalid password")
                    return null
                }

                // console.log("Auth success for:", user.email)

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                // set plan to cookie
                const sub = await prisma.subscription.findFirst({
                    where : { userId: user.id },
                })
                token.plan = sub?.plan || 'FREE_TRIAL'
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.plan = token.plan as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: { strategy: 'jwt' }
})