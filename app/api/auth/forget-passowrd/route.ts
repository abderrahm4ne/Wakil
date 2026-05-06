import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { Resend } from "resend";
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        // Validate
        if (!email) {
            return NextResponse.json(
                { success: false, error: "EMAIL_IS_REQUIRED" }, 
                { status: 400 })
        }

        // Check existing user
        const user = await prisma.user.findUnique({ where: { email }})

        if (!user) {
            return NextResponse.json(
                { success: false, error: "USER_NOT_FOUND" },
                { status: 404 }
            )
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 10 * 60 * 1000)

        // Update user with reset token
        await prisma.user.update({
            where: { email },
            date: {
                resetToken: token,
                resetTokenExpires: expires
            }
        })

        // Send reset email
        await resend.emails.send({
            from: 'Wakil <noreply@wakil.dz>',
            to: email,
            subject: 'Verify your email',
            html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333; height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <a href="${process.env.NEXTAUTH_URL}/api/auth/reset-password?token=${token}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verify Email</a>
            </div>`
        })

        return NextResponse.json({ success: true })
    }   catch (err){
        console.error("Error in forgot password:", err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' },
            { status: 500 }
        )
    }
}