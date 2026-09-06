'use client'

import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { subscriptions } from '@/types/subscription';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface BillingPlanComparisonProps {
  currentPlan: 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS';
}

interface PlanDetails {
  id: 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS';
  name: string;
  price: number;
  messageLimit: number | null;
  productLimit: number | null;
  features: string[];
}


export function BillingPlanComparison({
  currentPlan,
}: BillingPlanComparisonProps) {
    const { t, i18n } = useTranslation('dashboard')

    const plans: PlanDetails[] = subscriptions.map((sub) => ({
      id: sub.plan as PlanDetails['id'],
      name: t(sub.nameKey),
      price: sub.price,
      messageLimit: sub.limit,
      productLimit: sub.productLimit,
      features: sub.features.map(key => t(key))
    }));

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
    <div className={`${i18n.language === 'ar' ? 'font-arabic' : 'font-display'}`}>
      <h3 className="text-2xl font-semibold text-foreground mb-6">
        {('billing.compareAllPlans')}
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center w-[85%] h-[65vh] px-20 mx-auto">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;

          return (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col transition-all  ${
                isCurrent
                  ? 'border-emerald-500/50 bg-linear-to-b from-emerald-950/29 to-emerald-900/60 ring-1 ring-emerald-500/20'
                  : 'border-border hover:border-muted-foreground/30 bg-linear-to-b from-black to-secondary/10'
              }`}
            >
              <div className="space-y-4 flex-1">
                <div
                  className="text-2xl font-semibold text-foreground"
                >
                  
                  <h4 className="">
                    {plan.name}
                  </h4>
                  
                  <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 flex items-baseline gap-1">

                    <span className="text-2xl font-bold text-foreground">
                      {plan.price}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      {t('billing.DZD/mo')}
                    </span>

                  </motion.div>
                </div>

                {/* limits */}
                <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}>
                  {plan.messageLimit && (
                    <p className="text-xs text-muted-foreground">
                      {plan.messageLimit.toLocaleString()} {t('billing.messages/month')}
                    </p>
                  )}
                </motion.div>

                  {/* unlimited */}
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}>
                  {!plan.messageLimit && (
                    <p className="text-xs text-emerald-400">Unlimited messages</p>
                  )}
                </motion.div>

                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0}}
                transition={{ delay: 0.3 }}
                className="space-y-3 pt-4 border-t border-border">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </motion.div>

              </div>

              {isCurrent && (
                <div className="pt-4 border-t  text-emerald-400 text-sm font-semibold text-center">
                    Current Plan
                </div>
              )}

              {!isCurrent && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    {t('billing.changePlan')}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
    </motion.div>
  );
}
