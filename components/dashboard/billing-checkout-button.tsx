'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BillingCheckoutButtonProps {
  onCheckout: () => void | Promise<void>;
  isExpired: boolean;
}

export function BillingCheckoutButton({
  onCheckout,
  isExpired,
}: BillingCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onCheckout();
    } finally {
      setIsLoading(false);
    }
  };

  const label = isExpired ? 'Reactivate Subscription' : 'Complete Payment';

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size="lg"
      className="w-full sm:w-auto bg-white hover:bg-white/85 text-black/70 border border-border hover:cursor-pointer"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}
