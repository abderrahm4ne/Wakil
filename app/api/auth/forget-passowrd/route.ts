import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import crypto from 'crypto'
import { sendPasswordResetEmail } from "@/lib/email";


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

        if (!user || user.password === null) {
            return NextResponse.json(
                { success: true }
            )
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 10 * 60 * 1000)

        // Update user with reset token
        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpires: expires
            }
        })

        // Send reset email
        sendPasswordResetEmail(user.email, token)

        return NextResponse.json({ success: true })
    }   catch (err){
        console.error("Error in forgot password:", err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' },
            { status: 500 }
        )
    }
}