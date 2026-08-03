import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BillingCheckoutButton } from './billing-checkout-button';
import { CreditCard } from 'lucide-react';

interface BillingStatusCardProps {
  plan: 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS';
  isActive: boolean;
  currentPeriodEnd: string | null;
  hasSubscribedBefore: boolean;
  onCheckout: () => void | Promise<void>;
}

const planConfig: Record<
  'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS',
  { name: string; price: number }
> = {
  FREE_TRIAL: { name: 'Free Trial', price: 0 },
  STARTER: { name: 'Starter', price: 1500 },
  PRO: { name: 'Pro', price: 4000 },
  BUSINESS: { name: 'Business', price: 9000 },
};


export function BillingStatusCard({
  plan,
  isActive,
  currentPeriodEnd,
  hasSubscribedBefore,
  onCheckout,
}: BillingStatusCardProps) {
  const { name, price } = planConfig[plan];

  let statusLabel: string;
  let statusClasses: string;

  if (isActive) {
    statusLabel = 'Active';
    statusClasses = 'bg-secondary/10 text-secondary border border-secondary/30';
  } else if (!hasSubscribedBefore) {
    statusLabel = 'Payment Required';
    statusClasses = 'bg-destructive/10 text-destructive border border-destructive/30';
  } else {
    statusLabel = 'Expired';
    statusClasses = 'bg-destructive/10 text-destructive border border-destructive/30';
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const showCheckoutButton = !isActive && plan !== 'FREE_TRIAL';

  return (
    <Card className="p-6 md:p-8 border-emerald-900/30 bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-5 w-5 text-emerald-500" />
            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {price}
                <span className="text-lg text-muted-foreground ml-1">DZD/mo</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center rounded-full text-sm font-medium py-1.5 px-4 ${statusClasses}`}>
                {statusLabel}
              </div>
            </div>

            {isActive && currentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Renews on {formatDate(currentPeriodEnd)}
              </p>
            )}
          </div>
        </div>

        {showCheckoutButton && (
          <BillingCheckoutButton
            onCheckout={onCheckout}
            isExpired={hasSubscribedBefore}
          />
        )}
      </div>
    </Card>
  );
}
