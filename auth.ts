import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import { authConfig } from "@/auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
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
                    // console.log("Auth failed: Email not verified")
                    throw new Error ("EMAIL_NOT_VERIFIED")
                }

                if (!user.password) {
                    // console.log("Auth failed: No password set")
                    return null
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
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                // console.log("Google sign-in attempt for:", user.email)
                // console.log("Google env :", process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email as string }
                })

                if (existingUser && !existingUser.emailVerified) {
                    // console.log("Existing user found", existingUser.email)
                    return "/login?error=EMAIL_NOT_VERIFIED"
                }

                if (!existingUser) {
                    // console.log("Creating new user :", user.email)
                    const newUser = await prisma.user.create({
                        data: {
                            name: user.name ?? "",
                            email: user.email ?? "",
                            password: null,
                            emailVerified: new Date(),
                        }
                    })
                    // console.log("New user created:", newUser.email)
                }
            }

            return true
        },
        async jwt({ token, user, account, trigger }) {
            if (user) {
                let dbUser = user;

                if (account?.provider === 'google') {
                    dbUser = await prisma.user.findUnique({
                        where: { email: user.email as string }
                    }) ?? user
                }

                token.id = dbUser.id
                const sub = await prisma.subscription.findFirst({
                    where: {
                        userId: dbUser.id
                    }
                })
                token.plan = sub?.plan || 'FREE_TRIAL'
                token.isActive = sub?.isActive ?? false
            }
            if (trigger === "update") {
                const sub = await prisma.subscription.findFirst({
                    where: { userId: token.id as string }
                })
                token.plan = sub?.plan || 'FREE_TRIAL'
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.plan = token.plan as string
                session.user.isActive = token.isActive as string
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