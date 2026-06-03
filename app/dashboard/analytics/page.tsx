'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare,
  Users,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { AnalyticsMetricCard } from '@/components/dashboard/analytics-metric-card';
import { AnalyticsUsageCard } from '@/components/dashboard/analytics-usage-card';
import { AnalyticsDailyChart } from '@/components/dashboard/analytics-daily-chart';

interface DailyMessage {
  date: string;
  count: number;
}

interface AnalyticsData {
  messagesThisMonth: number;
  messageLimit: number | null;
  totalConversations: number;
  totalMessages: number;
  topTriggers: { trigger: string; count: number }[];
  dailyMessages: DailyMessage[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchAnalytics = async () => {
          try {
              setIsLoading(true);
              const res = await fetch('/api/analytics');
              const data = await res.json();
              if (!data.success) {
                  if (data.status === 401) {
                      setError('Not Authenticated. Login again.');
                      return;
                  }
                  if (data.status === 404) {
                      setError('No bot found.');
                      return;
                  }
                  setError('Error in fetching analytics data, try again later.');
                  return;
              }

              setData(data.data);
          } catch (err) {
              console.error('[Analytics Page] Error:', err);
              setError('Error in fetching analytics data, try again later.');
          } finally {
              setIsLoading(false);
          }
        };

    fetchAnalytics();
  }, []);

  const dailyData = (data?.dailyMessages ?? []).map((d) => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    messages: d.count,
  }));

  const messagesLast7Days = dailyData.reduce((sum, d) => sum + d.messages, 0)
  const mostTriggeredRule = data?.topTriggers?.[0]?.trigger ?? ''

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytique</h1>
          <p className="mt-2 text-slate-400">Suivez les performances de votre bot</p>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-slate-400">
          Monitor your bot's performance and message usage
        </p>
      </div>

      {/* Usage Card */}
      <AnalyticsUsageCard
        messagesUsed={data?.messagesThisMonth ?? 0}
        messageLimit={data?.messageLimit ?? 500}
        isLoading={isLoading}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          label="Total Conversations"
          value={isLoading ? '-' : data?.totalConversations ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label="Total messages"
          value={isLoading ? '-' : data?.totalMessages ?? 0}
          icon={MessageCircle}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label="Most Triggered Rule"
          value={isLoading ? '-' : mostTriggeredRule}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label="Messages last 7 days"
          value={isLoading ? '-' : messagesLast7Days ?? 0}
          icon={MessageSquare}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label="Messages this month"
          value={isLoading ? '-' : data?.messagesThisMonth ?? 0}
          icon={MessageSquare}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsDailyChart data={dailyData} isLoading={isLoading} />
      </div>

      {/* Empty State (ADDITIONAL)*/}
      {!isLoading && data && data.totalMessages === 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">No data available</h3>
          <p className="mt-2 text-slate-400">
            The data will appear here once your bot starts processing messages.
          </p>
        </div>
      )}
    </div>
  );
}