import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string, purpose: 'register' | 'change' | 'forget' = 'register') {
    const heading = purpose === 'change' ? 'Confirm your new email' : 'Confirm change your email'

    await resend.emails.send({
        from: 'Wakil <onboarding@resend.dev>',
        to: email,
        subject: heading,
        html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333; height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <p style="margin-bottom: 12px;">${heading}</p>
        <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verify Email</a>
        </div>`
    })
}

export async function sendPasswordResetEmail(email: string, token: string) {
    await resend.emails.send({
        from: 'Wakil <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your password',
        html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333; height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <p style="margin-bottom: 12px;">Reset your Wakil password. This link expires in 30 minutes.</p>
        <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${token}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
        </div>`
    })
}