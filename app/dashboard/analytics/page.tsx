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
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation('dashboard');
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
                      setError(t('analytics.unauthenticated'));
                      return;
                  }
                  if (data.status === 404) {
                      setError(t('analytics.noBot'));
                      return;
                  }
                  setError(t('analytics.loadError'));
                  return;
              }

              setData(data.data);
          } catch (err) {
              console.error('[Analytics Page] Error:', err);
              setError(t('analytics.loadError'));
          } finally {
              setIsLoading(false);
          }
        };

    fetchAnalytics();
  }, [t]);

  const dailyData = (data?.dailyMessages ?? []).map((d) => ({
    date: new Date(d.date).toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit' }),
    messages: d.count,
  }));

  const messagesLast7Days = dailyData.reduce((sum, d) => sum + d.messages, 0)
  const mostTriggeredRule = data?.topTriggers?.[0]?.trigger ?? ''

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('analytics.title')}</h1>
          <p className="mt-2 text-slate-400">{t('analytics.subtitle')}</p>
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
        <h1 className="text-3xl font-bold text-white">{t('analytics.title')}</h1>
        <p className="mt-2 text-slate-400">
          {t('analytics.subtitle')}
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
          label={t('analytics.totalConversations')}
          value={isLoading ? '-' : data?.totalConversations ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label={t('analytics.totalMessages')}
          value={isLoading ? '-' : data?.totalMessages ?? 0}
          icon={MessageCircle}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label={t('analytics.mostTriggered')}
          value={isLoading ? '-' : mostTriggeredRule}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label={t('analytics.last7Days')}
          value={isLoading ? '-' : messagesLast7Days ?? 0}
          icon={MessageSquare}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label={t('analytics.thisMonth')}
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
          <h3 className="mt-4 text-lg font-semibold text-white">{t('analytics.noData')}</h3>
          <p className="mt-2 text-slate-400">
            {t('analytics.noDataDescription')}
          </p>
        </div>
      )}
    </div>
  );
}
