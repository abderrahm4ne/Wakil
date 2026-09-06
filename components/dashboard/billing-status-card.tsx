'use client';

import { motion } from 'framer-motion';
import { CreditCard, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BillingCheckoutButton } from './billing-checkout-button';
import { subscriptions } from '@/types/subscription';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

interface BillingStatusCardProps {
  plan: 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS';
  isActive: boolean;
  currentPeriodEnd: string | null;
  hasSubscribedBefore: boolean;
}

const PLAN_CONFIG = Object.fromEntries(
  subscriptions.map((sub) => [
    sub.plan,
    { name: sub.name, price: sub.price, limit: sub.limit }
  ])
) as Record<string, { name: string; price: number; limit: number | null }>;

export function BillingStatusCard({
    plan,
    isActive,
    currentPeriodEnd,
    hasSubscribedBefore,
}: BillingStatusCardProps) {
    const { t } = useTranslation('dashboard');
    const { name, price, limit } = PLAN_CONFIG[plan];

    const statusConfig = isActive
        ? { label: t('billing.active'), classes: 'bg-secondary/10 text-secondary border         border-secondary/30' }
        : hasSubscribedBefore
        ? { label: t('billing.expired'), classes: 'bg-destructive/10 text-destructive border border-destructive/30' }
        : { label: t('billing.paymentRequired'), classes: 'bg-amber-500/10 text-amber-500 border border-amber-500/30' };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const showCheckoutButton = !isActive && plan != 'FREE_TRIAL';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
          <Card className="relative overflow-hidden border-border bg-linear-to-tr from-black to-black/5 p-6 md:p-8">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
              animate={{
                x: [0, 20, -20, 0],
                y: [0, 30, -30, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

          <div className={`${i18n.language === 'ar' ? 'font-arabic' : 'font-display'} relative z-10 flex flex-col gap-6`}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start justify-between"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-2.5 rounded-lg bg-secondary/10 border border-secondary/20"
                >
                  <CreditCard className="h-6 w-6 text-secondary" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{name}</h2>
                  <p className="text-md text-muted-foreground font-normal mt-0.5">
                    {isActive ? t('billing.currentPlan') : t('billing.availablePlan')}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className={`inline-flex items-center rounded-full text-md font-semibold py-1.5 px-4 ${statusConfig.classes}`}
              >
                {statusConfig.label}
              </motion.div>
            </motion.div>

            {/* Pricing Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <div className="flex items-baseline gap-1">
                <motion.span
                  className="text-4xl font-semibold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  {price.toLocaleString()}
                </motion.span>
                <span className="text-lg font-semibold text-muted-foreground">{t('billing.DZD/mo')}</span>
              </div>
              {limit && (
                <div className="flex items-center gap-2 pt-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <p className="text-sm text-muted-foreground">
                    {limit === null
                      ? t('billing.unlimitedMessages')
                      : `${limit.toLocaleString()} ${t('billing.messagesPerMonth')}`}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Status Info */}
            {isActive && currentPeriodEnd && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-lg bg-secondary/5 border border-secondary/20"
              >
                <p className="text-sm font-normal text-muted-foreground">
                  {t('billing.renewsOn', { date: formatDate(currentPeriodEnd) })}
                </p>
              </motion.div>
            )}

            {/* CTA Button */}
            {showCheckoutButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <BillingCheckoutButton
                  isExpired={hasSubscribedBefore}
                />
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    );
}