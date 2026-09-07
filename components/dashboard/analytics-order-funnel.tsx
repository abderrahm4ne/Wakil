'use client'

import { PieChart } from 'lucide-react'

import { MotionSection } from './analytics-motion-section'

const FUNNEL_COLORS: Record<string, string> = {
  PENDING: 'bg-muted-foreground',
  PENDING_REVIEW: 'bg-orange-500',
  CONFIRMED: 'bg-green-500',
  CANCELLED: 'bg-destructive'
}

interface OrderFunnelProps {
  funnel: Record<string, number>

  labels: {
    orderFunnel: string
    noOrdersYet: string
  }
}

export function OrderFunnel({
  funnel,
  labels
}: OrderFunnelProps) {

  const funnelTotal = Object.values(funnel)
    .reduce((a, b) => a + b, 0)

  return (
    <MotionSection delay={0.3}>
      <div className="bg-card border border-border rounded-2xl p-6">

        <h2 className="text-lg font-normal mb-4 flex items-center gap-2">

          <PieChart
            size={22}
            className="text-secondary"
          />

          {labels.orderFunnel}

        </h2>

        {funnelTotal === 0 ? (

          <p className="text-muted-foreground text-sm py-6 text-center font-semibold">
            {labels.noOrdersYet}
          </p>

        ) : (

          <div className="space-y-3">

            {Object.entries(funnel).map(
              ([status, count]) => (

                <div
                  key={status}
                  className="space-y-1"
                >

                  <div className="flex justify-between text-sm">

                    <span className="text-foreground font-medium">
                      {status.replace('_', ' ')}
                    </span>

                    <span className="text-muted-foreground">
                      {count}
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
                        FUNNEL_COLORS[status]
                      }`}
                      style={{
                        width: `${
                          funnelTotal
                            ? (count / funnelTotal) * 100
                            : 0
                        }%`
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>
    </MotionSection>
  )
}