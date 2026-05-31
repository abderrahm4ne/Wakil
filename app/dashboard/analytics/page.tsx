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
import { AnalyticsMonthlyChart } from '@/components/dashboard/analytics-monthly-chart';
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
        const response = await fetch('/api/analytics');

        if (!response.ok) {
          if (response.status === 401) {
            setError('Non authentifié. Veuillez vous reconnecter.');
            return;
          }
          if (response.status === 404) {
            setError('Bot non trouvé.');
            return;
          }
          setError('Erreur lors du chargement des données.');
          return;
        }

        const json = await response.json();
        setData(json.data);
      } catch (err) {
        console.error('[Analytics Page] Error:', err);
        setError('Erreur lors du chargement des données.');
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

  const mostActiveDay = dailyData.length
    ? dailyData.reduce((a, b) => (a.messages >= b.messages ? a : b)).date
    : null;

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
        <h1 className="text-3xl font-bold text-white">Analytique</h1>
        <p className="mt-2 text-slate-400">
          Suivez les performances de votre bot et l&apos;utilisation des messages
        </p>
      </div>

      {/* Usage Card - Full Width */}
      <AnalyticsUsageCard
        messagesUsed={data?.messagesThisMonth ?? 0}
        messageLimit={data?.messageLimit ?? 500}
        isLoading={isLoading}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          label="Conversations totales"
          value={isLoading ? '-' : (data?.totalConversations ?? 0).toLocaleString('fr-FR')}
          icon={Users}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label="Messages totaux"
          value={isLoading ? '-' : (data?.totalMessages ?? 0).toLocaleString('fr-FR')}
          icon={MessageCircle}
          isLoading={isLoading}
        />
        <AnalyticsMetricCard
          label="Jour le plus actif"
          value={isLoading ? '-' : mostActiveDay ?? 'N/A'}
          icon={TrendingUp}
          isLoading={isLoading}
          subtext="7 derniers jours"
        />
        <AnalyticsMetricCard
          label="Messages ce mois"
          value={isLoading ? '-' : (data?.messagesThisMonth ?? 0).toLocaleString('fr-FR')}
          icon={MessageSquare}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsDailyChart data={dailyData} isLoading={isLoading} />
      </div>

      {/* Empty State */}
      {!isLoading && data && data.totalMessages === 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">Aucune donnée disponible</h3>
          <p className="mt-2 text-slate-400">
            Les données apparaîtront ici une fois que votre bot commencera à traiter les messages.
          </p>
        </div>
      )}
    </div>
  );
}