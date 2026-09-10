import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BillingStatusCard } from '@/components/billing/status-card'
import { BillingPlanComparison } from '@/components/billing/plan-comparision'
import { BillingWarningBanner } from '@/components/billing/warning-banner'
import { CreditCard, ReceiptText, ShieldCheck } from 'lucide-react'
import getLang from '@/lib/locale'
import i18n from '@/lib/i18n-server'

export default async function BillingPage() {
    const lang = await getLang()
    const t = i18n.getFixedT(lang, 'dashboard')
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
          <section className={`rounded-lg ${lang === 'ar' ? 'font-arabic': 'font-display'} border border-border bg-linear-to-tr from-black to-black/5 p-6 md:p-8`}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>

                      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
                        {t('billing.title')}
                        </p>

                      <h1 className="text-4xl font-semibold text-foreground">
                        {t('billing.billingNSubscription')}
                      </h1>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                          {t('billing.subTitle')}
                      </p>
                      
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                            <CreditCard className="mb-2 h-4 w-4 text-[#00D4AA]" />
                            <p className="text-slate-500">{t('billing.plan')}</p>
                            <p className="font-semibold text-white">{subscriptionData.plan.replace('_', ' ')}</p>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                            <ShieldCheck className="mb-2 h-4 w-4 text-[#00D4AA]" />
                            <p className="text-slate-500">{t('billing.status')}</p>
                            <p className="font-semibold text-white">{subscriptionData.isActive ? t('billing.active') : t('billing.inActive')}</p>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                            <ReceiptText className="mb-2 h-4 w-4 text-[#00D4AA]" />
                            <p className="text-slate-500">{t('billing.billing')}</p>
                            <p className="font-semibold text-white">{subscriptionData.hasSubscribedBefore ? t('billing.saved') : t('billing.old')}</p>
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
          />

          <BillingPlanComparison currentPlan={subscriptionData.plan} />
      </div>
    )
}