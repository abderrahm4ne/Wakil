import { Card } from '@/components/ui/card';
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
      "500 messages", 
      "Rule-based only", 
      "1 Channel"
    ]
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: 1500,
    messageLimit: 2000,
    features: [
      "2,000 messages/month", 
      "Rule-based only", 
      "Unlimited pages", 
      "1 Channel"
    ]
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 4000,
    messageLimit: 10000,
    features: [
      "10,000 messages/month", 
      "AI included", 
      "2 Channels", 
      "Smart escalation", 
      "Advanced analytics"
    ]
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    price: 9000,
    messageLimit: null,
    features: [
      "Unlimited messages", 
      "AI included", 
      "2 Channels", 
      "Priority support" 
    ]
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
