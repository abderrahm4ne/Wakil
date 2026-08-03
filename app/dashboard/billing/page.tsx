import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BillingStatusCard } from '@/components/dashboard/billing-status-card'
import { BillingPlanComparison } from '@/components/dashboard/billing-plan-comparision'
import { BillingWarningBanner } from '@/components/dashboard/billing-warning-banner'

async function handleCheckout() {
  'use server'

  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })
  if (!subscription || subscription.plan === 'FREE_TRIAL') redirect('/dashboard/billing')

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: (await import('next/headers')).cookies().toString(),
    },
    body: JSON.stringify({ plan: subscription.plan }),
  })
  const data = await res.json()
  if (data.url) redirect(data.url)
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