'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface UsageCardProps {
  messagesUsed: number;
  messageLimit: number;
  isLoading?: boolean;
}

export function AnalyticsUsageCard({
  messagesUsed,
  messageLimit,
  isLoading = false,
}: UsageCardProps) {
  const isUnlimited = messageLimit === Infinity;
  const percentage = isUnlimited ? 100 : (messagesUsed / messageLimit) * 100;
  const isHigh = percentage >= 90 && !isUnlimited;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Messages this month
        </h3>
        <p className="text-sm text-slate-400">
          {isUnlimited
            ? 'Unlimited limit'
            : `${messagesUsed.toLocaleString()} / ${messageLimit.toLocaleString()}`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-2 w-full bg-slate-700" />
          <Skeleton className="h-4 w-32 bg-slate-700" />
        </div>
      ) : (
        <>
          <div className="mb-3">
            <Progress
              value={Math.min(percentage, 100)}
              className="h-2 bg-slate-700"

            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {isUnlimited
                ? 'Unlimited plan'
                : `${((messagesUsed / messageLimit) * 100).toFixed(0)}% used`}
            </p>
            {isHigh && (
              <p className="text-xs font-semibold text-red-400">
                Approaching limit
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
