'use client'

import { TrendingUp } from 'lucide-react'

import { MotionSection } from './analytics-motion-section'

interface ConversationTrendItem {
  date: string
  count: number
}

interface ConversationTrendProps {
  conversationTrend: ConversationTrendItem[]

  title: string
}

export function ConversationTrend({
  conversationTrend,
  title
}: ConversationTrendProps) {

  const maxConvCount = Math.max(
    ...conversationTrend.map(
      item => item.count
    ),
    1
  )

  return (
    <MotionSection delay={0.4}>
      <div className="bg-card border border-border rounded-2xl p-6">

        <h2 className="text-lg font-normal mb-4 flex items-center gap-2">

          <TrendingUp
            size={18}
            className="text-secondary"
          />

          {title}

        </h2>

        <div className="flex items-end gap-1 h-32">

          {conversationTrend.map(item => (

            <div
              key={item.date}
              className="flex-1 h-full flex flex-col justify-end items-center gap-1 group/bar"
            >

              <div
                className="
                  w-full
                  rounded-t-sm
                  bg-secondary/40
                  group-hover/bar:bg-secondary
                  transition-colors
                "
                style={{
                  height: `${
                    (item.count / maxConvCount) * 100
                  }%`,

                  minHeight:
                    item.count > 0
                      ? '4px'
                      : '0px'
                }}
              />

              <span className="text-[10px] text-muted-foreground">
                {item.date.slice(8)}
              </span>

            </div>

          ))}

        </div>

      </div>
    </MotionSection>
  )
}