import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface BillingPlanComparisonProps {
  currentPlan: 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS';
}

interface PlanDetails {
  id: 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS';
  name: string;
  price: number;
  messageLimit: number | null;
  features: string[];
}

const plans: PlanDetails[] = [
  {
    id: 'FREE_TRIAL',
    name: 'Free Trial',
    price: 0,
    messageLimit: 500,
    features: [
      'Up to 500 messages/month',
      'Single bot',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: 1500,
    messageLimit: 2000,
    features: [
      'Up to 2,000 messages/month',
      'Single bot',
      'Advanced analytics',
      'Priority support',
      'Multi-language support',
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 4000,
    messageLimit: 10000,
    features: [
      'Up to 10,000 messages/month',
      'Multiple bots',
      'Real-time analytics',
      '24/7 support',
      'Multi-language support',
      'Custom integrations',
    ],
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    price: 9000,
    messageLimit: null,
    features: [
      'Unlimited messages',
      'Unlimited bots',
      'Custom analytics',
      'Dedicated support',
      'Multi-language support',
      'Custom integrations',
      'API access',
    ],
  },
];

export function BillingPlanComparison({
  currentPlan,
}: BillingPlanComparisonProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Compare all plans
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;

          return (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col transition-all ${
                isCurrent
                  ? 'border-emerald-500/50 bg-emerald-950/20 ring-1 ring-emerald-500/20'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      DZD/mo
                    </span>
                  </div>
                </div>

                {plan.messageLimit && (
                  <p className="text-xs text-muted-foreground">
                    {plan.messageLimit.toLocaleString()} messages/month
                  </p>
                )}

                {!plan.messageLimit && (
                  <p className="text-xs text-emerald-400">Unlimited messages</p>
                )}

                <div className="space-y-3 pt-4 border-t border-border">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {isCurrent && (
                <div className="pt-4 border-t  text-emerald-400 text-sm font-semibold text-center">
                    Current Plan
                </div>
              )}

              {!isCurrent && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Contact support to change plan
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
