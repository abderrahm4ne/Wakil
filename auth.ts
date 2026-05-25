import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from "@/auth.config"
import { error } from 'console'

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
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                // validate
                if(!user){
                    throw new Error ("USER_NOT_FOUND")
                }

                if (!user.emailVerified) {
                    throw new Error ("EMAIL_NOT_VERFIED")
                }

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
                // set plan to cookie
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