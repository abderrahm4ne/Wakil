import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BillingStatusCard } from '@/components/dashboard/billing-status-card'
import { BillingPlanComparison } from '@/components/dashboard/billing-plan-comparision'
import { BillingWarningBanner } from '@/components/dashboard/billing-warning-banner'
import { stripe } from '@/lib/stripe'
import { CreditCard, ReceiptText, ShieldCheck } from 'lucide-react'

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
    console.log("checkout created")

    if (!checkoutSession.url) throw new Error('Failed to create checkout session')

    redirect(checkoutSession.url)
}

export default async function BillingPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
    })
    if (!subscription) redirect('/dashboard/billing')

    const subscriptionData = {
        plan: subscription.plan,
        isActive: subscription.isActive,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
        hasSubscribedBefore: subscription.providerSubscriptionId !== null,
    }

    return (
      <div className="space-y-6">
          <section className="rounded-lg border border-slate-800 bg-slate-950 p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#00D4AA]">Billing desk</p>
                      <h1 className="text-4xl font-bold text-foreground">Billing & Subscription</h1>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                          Keep payments, renewal status, and plan limits visible before your bot hits a billing pause.
                      </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                          <CreditCard className="mb-2 h-4 w-4 text-[#00D4AA]" />
                          <p className="text-slate-500">Plan</p>
                          <p className="font-semibold text-white">{subscriptionData.plan.replace('_', ' ')}</p>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                          <ShieldCheck className="mb-2 h-4 w-4 text-[#00D4AA]" />
                          <p className="text-slate-500">Status</p>
                          <p className="font-semibold text-white">{subscriptionData.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                          <ReceiptText className="mb-2 h-4 w-4 text-[#00D4AA]" />
                          <p className="text-slate-500">Billing</p>
                          <p className="font-semibold text-white">{subscriptionData.hasSubscribedBefore ? 'Saved' : 'New'}</p>
                      </div>
                  </div>
              </div>
          </section>

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