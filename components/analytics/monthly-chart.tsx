'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyChartProps {
  data: Array<{
    month: string;
    messages: number;
  }>;
  isLoading?: boolean;
}

export function AnalyticsMonthlyChart({
  data,
  isLoading = false,
}: MonthlyChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
        <Skeleton className="h-96 w-full bg-slate-700" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">
        Messages des 6 derniers mois
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(71, 85, 105, 0.5)"
          />
          <XAxis
            dataKey="month"
            stroke="rgba(148, 163, 184, 0.6)"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis
            stroke="rgba(148, 163, 184, 0.6)"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
          <Bar
            dataKey="messages"
            fill="#4F8EF7"
            radius={[8, 8, 0, 0]}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
