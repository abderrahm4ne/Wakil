import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

const VALID_PLANS = ['FREETRIAL','STARTER', 'PRO', 'BUSINESS']

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, plan } = await req.json()

        // Validate
        if (!name || !email || !password || !plan) {
            return NextResponse.json(
              { success: false, error: 'MISSING_FIELDS' },
              { status: 400 }
            )
        }

        if (!VALID_PLANS.includes(plan)){
          return NextResponse.json(
              { success: false, error: 'INVALID_PLAN' },
              { status: 400 }
          )
        }

        // Check existing user
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json(
              { success: false, error: 'EMAIL_TAKEN' },
              { status: 409 }
            )
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 12)

        // Generate verification token
        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

        // Create user + subscription + token
        await prisma.$transaction([
          prisma.user.create({
            data: {
              name,
              email,
              password: hashed,
              verifyToken: token,
              verifyTokenExpires: expires,
              subscription: {
                create: { 
                  plan: plan,
                  isActive: false,
                  provider: 'STRIPE'
                }
              }
            }
          })
        ])

        // Send verification email
        sendVerificationEmail(email, token, 'register')

      } catch (err) {
      // console.error("Error in Register", err)
      return NextResponse.json(
        { success: false, error: 'SERVER_ERROR' },
        { status: 500 }
      )
    }
}