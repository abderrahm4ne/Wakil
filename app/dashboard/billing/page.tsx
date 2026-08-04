import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BillingStatusCard } from '@/components/dashboard/billing-status-card'
import { BillingPlanComparison } from '@/components/dashboard/billing-plan-comparision'
import { BillingWarningBanner } from '@/components/dashboard/billing-warning-banner'
import { stripe } from '@/lib/stripe'

async function handleCheckout() {
    'use server'

    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
    })

    if (!subscription || subscription.plan === 'FREE_TRIAL') {
        redirect('/dashboard/billing')
    }

    const PLAN_PRICE_IDS: Record<string, string> = {
        STARTER: process.env.STARTER_PLAN_ID!,
        PRO: process.env.PRO_PLAN_ID!,
        BUSINESS: process.env.BUSINESS_PLAN_ID!,
    }

    const priceId = PLAN_PRICE_IDS[subscription.plan.toUpperCase()]
    if (!priceId) throw new Error('Invalid plan configuration')

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: session.user.id,
        customer_email: session.user.email ?? undefined,
        metadata: {
            plan: subscription.plan,
            userId: session.user.id,
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?checkout=cancelled`,
    })

    if (!checkoutSession.url) throw new Error('Failed to create checkout session')

    redirect(checkoutSession.url)
}

export default async function BillingPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    })
    if (!subscription) redirect('/dashboard')

    const subscriptionData = {
        plan: subscription.plan,
        isActive: subscription.isActive,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
        hasSubscribedBefore: subscription.providerSubscriptionId !== null,
    }

    return (
      <div className="space-y-8">
          <div>
              <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                  Manage your subscription plan and billing information
              </p>
          </div>

          {!subscriptionData.isActive && subscriptionData.plan !== 'FREE_TRIAL' && (
              <BillingWarningBanner />
          )}

          <BillingStatusCard
            plan={subscriptionData.plan}
            isActive={subscriptionData.isActive}
            currentPeriodEnd={subscriptionData.currentPeriodEnd}
            hasSubscribedBefore={subscriptionData.hasSubscribedBefore}
            onCheckout={handleCheckout}
          />

          <BillingPlanComparison currentPlan={subscriptionData.plan} />
      </div>
    )
}