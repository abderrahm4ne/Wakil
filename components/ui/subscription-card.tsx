'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface SubscriptionCardProps {
    planName: string;
    status: 'active' | 'pending_payment' | 'expired';
    messagesUsed: number;
    messagesLimit: number;
    renewalDate: string;
}

export function SubscriptionCard({
    planName,
    status,
    messagesUsed,
    messagesLimit,
    renewalDate,
}: SubscriptionCardProps) {
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const messagesPercentage = (messagesUsed / messagesLimit) * 100;

    const getStatusBadge = () => {
        switch (status) {
            case 'active':
                return (
                    <Badge className="bg-[#00D4AA] text-slate-900 hover:bg-[#00D4AA] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </Badge>
                );
            case 'pending_payment':
                return (
                    <Badge className="bg-yellow-500 text-slate-900 hover:bg-yellow-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Pending Payment
                    </Badge>
                );
            case 'expired':
                return (
                    <Badge className="bg-red-500 text-white hover:bg-red-500 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Expired
                    </Badge>
                );
            default:
              return null;
        }
    };

  const getProgressBarColor = () => {
    if (messagesPercentage < 70) return 'bg-[#00D4AA]';
    if (messagesPercentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      className="p-8 rounded-lg border"
      style={{
        backgroundColor: 'var(--wakil-card)',
        borderColor: 'var(--wakil-border)',
      }}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{planName} Plan</h3>
          <p className="text-slate-400">Your current subscription</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-slate-300 font-semibold">Messages This Month</label>
          <span className="text-slate-400">
            {messagesUsed.toLocaleString()} / {messagesLimit.toLocaleString()}
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full overflow-hidden bg-border"
        >
          <div
            className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(messagesPercentage, 100)}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {Math.round(messagesPercentage)}% of your monthly limit used
        </p>
      </div>

      <div
        className="p-4 rounded-lg mb-8"
        style={{ backgroundColor: 'var(--wakil-bg)' }}
      >
        <p className="text-slate-400 text-sm mb-1">Plan Renewal Date</p>
        <p className="text-xl font-semibold text-white">{renewalDate}</p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => setIsUpgrading(!isUpgrading)}
          disabled={isUpgrading || isCanceling}
          className="flex-1 border-borde bg-secondary text-black hover:cursor-pointer hover:bg-secondary/90 "
        >
          {isUpgrading ? 'Processing...' : 'Upgrade Plan'}
        </Button>
        <Button
          onClick={() => setIsCanceling(!isCanceling)}
          disabled={isUpgrading || isCanceling}
          variant="outline"
          className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-500 hover:cursor-pointer"
        >
          {isCanceling ? 'Processing...' : 'Cancel Plan'}
        </Button>
      </div>
    </div>
  );
}
