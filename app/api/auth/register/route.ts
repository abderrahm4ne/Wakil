import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)
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
                  isActive: false
                }
              }
            }
          })
        ])

        // Send verification email
        await resend.emails.send({
          from: 'Wakil <onboarding@resend.dev>',
          to: email,
          subject: 'Verify your email',
          html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333; height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verify Email</a>
          </div>`
        })

        return NextResponse.json(
          { success: true },
          { status: 201 })

      } catch (err) {
      console.error("Error in Register", err)
      return NextResponse.json(
        { success: false, error: 'SERVER_ERROR' },
        { status: 500 }
      )
    }
}