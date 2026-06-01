'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DailyChartProps {
  data: Array<{
    date: string;
    messages: number;
  }>;
  isLoading?: boolean;
}

export function AnalyticsDailyChart({
  data,
  isLoading = false,
}: DailyChartProps) {
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
        Messages per day (last 30 days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(71, 85, 105, 0.5)"
          />
          <XAxis
            dataKey="date"
            stroke="rgba(148, 163, 184, 0.6)"
            style={{ fontSize: '0.75rem' }}
            interval={Math.floor(data.length / 6)}
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
          <Line
            type="monotone"
            dataKey="messages"
            stroke="#00D4AA"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
