import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                // validate
                if (!user || !user.emailVerified) return null

                const valid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )
                if (!valid) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                // Fetch plan
                const sub = await prisma.subscription.findFirst({
                    where : { userId: user.id },
                })
                token.plan = sub?.plan || 'FREE'
            }
            return token
        },
        async session({ session, token }) {
        session.user.id = token.id as string
        session.user.plan = token.plan as string
        return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: { strategy: 'jwt' }
})