'use client'

import {
  Bot,
  Clock,
  MessageSquareMore
} from 'lucide-react'

import { MotionSection } from './analytics-motion-section'

interface AnalyticsStatsProps {
  conversionRate: number
  convertedConversations: number
  totalConversations: number
  tokenUsed: number
  avgResponseMs: number | null
  unAnsweredConversations: number
  averageMessagesPerConversation: number

  labels: {
    conversionRate: string
    conversationsToOrders: string
    tokenUsage: string
    token: string
    avgResponseTime: string
    unAnsweredConversation: string
    averageMessagesPerConversation: string
  }
}

function formatMs(ms: number | null) {
  if (ms === null) return '—'

  const mins = Math.round(ms / 60000)

  if (mins < 1) return '<1 min'

  if (mins < 60) return `${mins} min`

  return `${(mins / 60).toFixed(1)} hr`
}

function ConversionRing({ value }: { value: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius

  const offset =
    circumference -
    (value / 100) * circumference

  const color =
    value >= 30
      ? '#00D4AA'
      : value >= 15
        ? '#eab308'
        : '#8B8FA8'

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg
        className="w-full h-full -rotate-90"
        viewBox="0 0 80 80"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-muted/30"
        />

        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">
          {Math.round(value)}%
        </span>
      </div>
    </div>
  )
}

export function AnalyticsStats({
  conversionRate,
  convertedConversations,
  totalConversations,
  tokenUsed,
  avgResponseMs,
  unAnsweredConversations,
  averageMessagesPerConversation,
  labels
}: AnalyticsStatsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Conversion Rate */}
      <MotionSection delay={0.05}>
        <div className="group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl p-6 flex items-center gap-6">

          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />

          <ConversionRing value={conversionRate} />

          <div className="relative">
            <p className="text-md text-muted-foreground">
              {labels.conversionRate}
            </p>

            <p className="text-2xl font-semibold text-foreground">
              {convertedConversations}/{totalConversations}
            </p>

            <p className="text-sm text-muted-foreground">
              {labels.conversationsToOrders}
            </p>
          </div>

        </div>
      </MotionSection>

      {/* Token Usage */}
      <MotionSection delay={0.1}>
        <div className="group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl p-6 flex flex-col justify-center space-y-2">

          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />

          <Bot
            className="relative text-secondary"
            size={24}
          />

          <p className="relative text-md text-muted-foreground">
            {labels.tokenUsage}
          </p>

          <p className="relative text-3xl font-semibold text-foreground">
            {tokenUsed.toLocaleString()}

            <span className="text-[1.1rem] font-normal">
              {' '}
              {labels.token}
            </span>
          </p>

        </div>
      </MotionSection>

      {/* Response Time */}
      <MotionSection delay={0.15}>
        <div className="group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl p-6 flex flex-col justify-center space-y-2">

          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />

          <Clock
            className="relative text-secondary"
            size={24}
          />

          <p className="relative text-md text-muted-foreground">
            {labels.avgResponseTime}
          </p>

          <p className="relative text-3xl font-semibold text-foreground">
            {formatMs(avgResponseMs)}
          </p>

        </div>
      </MotionSection>

      {/* Unanswered */}
      <MotionSection delay={0.2}>
        <div className="group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl p-6 flex flex-col justify-center space-y-2">

          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />

          <MessageSquareMore
            className="relative text-secondary"
            size={24}
          />

          <p className="relative text-md text-muted-foreground">
            {labels.unAnsweredConversation}
          </p>

          <p className="relative text-3xl font-semibold text-foreground">
            {unAnsweredConversations}
          </p>

        </div>
      </MotionSection>

      {/* Average Messages */}
      <MotionSection delay={0.25}>
        <div className="group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl p-6 flex flex-col justify-center space-y-2">

          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />

          <MessageSquareMore
            className="relative text-secondary"
            size={24}
          />

          <p className="relative text-md text-muted-foreground">
            {labels.averageMessagesPerConversation}
          </p>

          <p className="relative text-3xl font-semibold text-foreground">
            {averageMessagesPerConversation}
          </p>

        </div>
      </MotionSection>

    </section>
  )
}