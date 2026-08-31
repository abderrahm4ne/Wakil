import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST() {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
        }

        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        })

        if (!subscription?.providerCustomerId) {
            return NextResponse.json({ success: false, error: 'NO_CUSTOMER' }, { status: 400 })
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.providerCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/subscription`,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (err) {
        console.error('error in portal route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}