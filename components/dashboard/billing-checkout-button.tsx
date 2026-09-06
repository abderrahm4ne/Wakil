'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next';

interface BillingCheckoutButtonProps {
  isExpired: boolean;
}

export function BillingCheckoutButton({
  isExpired,
}: BillingCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('dashboard')

  const handleClick = async () => {
    setIsLoading(true);
    try {
      router.push("/dashboard/subscription")
    } finally {
      setIsLoading(false);
    }
  };

  const label = isExpired ? t('billing.reActivateSubscription') : t('billing.completePayement');

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size="lg"
      className="w-full sm:w-auto bg-white hover:bg-white/85 text-black/70 border border-border hover:cursor-pointer font-semibold"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}
