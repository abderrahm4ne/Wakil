import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { Plan } from '@/generated/prisma/enums'

const PLAN_ORDER: Record<Plan, number> = {
  FREE_TRIAL: 0,
  STARTER: 1,
  PRO: 2,
  BUSINESS: 3
}

const PLAN_PRICE_IDS: Record<Plan, string> = {
  FREE_TRIAL: '',
  STARTER: process.env.STRIPE_STARTER_PRICE_ID!,
  PRO: process.env.STRIPE_PRO_PRICE_ID!,
  BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID!,
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const { plan, billingMode } = await req.json()
        
        if (!plan || !Object.keys(PLAN_ORDER).includes(plan)) {
            return NextResponse.json(
                { success: false, error: 'INVALID_PLAN' }, { status: 400 }
            )
        }

        if (!billingMode || !['MONTHLY', 'ONE_TIME'].includes(billingMode)) {
            return NextResponse.json(
                { success: false, error: 'INVALID_BILLING_MODE' }, { status: 400 }
            )
        }

        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        })

        if (!subscription) {
            return NextResponse.json(
                { success: false, error: 'NO_SUBSCRIPTION' }, { status: 400 }
            )
        }

        if (subscription.isActive && subscription.billingMode === 'ONE_TIME') {
            return NextResponse.json(
                { success: false, error: 'CANNOT_UPGRADE_ONE_TIME' }, { status: 400 }
            )
        }

        if (subscription.isActive && subscription.plan === plan && subscription.billingMode === billingMode) {
            return NextResponse.json(
                { success: false, error: 'ALREADY_ON_THIS_PLAN' }, { status: 400 }
            )
        }


        if (!subscription.providerCustomerId) {
            const customer = await stripe.customers.create({
                email: session.user.email ?? undefined,
                metadata: { userId: session.user.id }
            })

            await prisma.subscription.update({
                where: { userId: session.user.id },
                data: { providerCustomerId: customer.id }
            })

            subscription.providerCustomerId = customer.id
        }

        const priceId = PLAN_PRICE_IDS[plan as Plan]
        if (!priceId) {
            return NextResponse.json(
                { success: false, error: 'PLAN_NOT_AVAILABLE' }, { status: 400 }
            )
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: subscription.providerCustomerId,
            mode: billingMode === 'ONE_TIME' ? 'payment' : 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                }
            ],
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/onboarding/plan-selection?canceled=true`,
            metadata: {
                userId: session.user.id,
                plan: plan,
                billingMode: billingMode,
                upgradeFrom: subscription.plan,
            }
        })

        return NextResponse.json({ success: true, url: checkoutSession.url })
    } catch (err) {
        console.error('error in upgrade subscription', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}