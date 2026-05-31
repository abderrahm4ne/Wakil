'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  isLoading?: boolean;
  subtext?: string;
}

export function AnalyticsMetricCard({
  label,
  value,
  icon: Icon,
  isLoading = false,
  subtext,
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-24 bg-slate-700" />
          ) : (
            <>
              <p className="mt-2 text-3xl font-bold text-white">{value}</p>
              {subtext && (
                <p className="mt-1 text-xs text-slate-500">{subtext}</p>
              )}
            </>
          )}
        </div>
        <div className="rounded-lg bg-blue-500/10 p-3">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
      </div>
    </div>
  );
}
