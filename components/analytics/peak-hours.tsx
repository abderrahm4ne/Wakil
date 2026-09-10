'use client'

import { TrendingUp } from 'lucide-react'

import { MotionSection } from './motion-section'

interface PeakHoursProps {
  peakHours: number[]

  title: string
}

export function PeakHours({
  peakHours,
  title
}: PeakHoursProps) {

  const maxHourCount = Math.max(
    ...peakHours,
    1
  )

  return (
    <MotionSection delay={0.35}>
      <div className="bg-card border border-border rounded-2xl p-6">

        <h2 className="text-lg font-normal mb-4 flex items-center gap-2">

          <TrendingUp
            size={18}
            className="text-secondary"
          />

          {title}

        </h2>

        <div className="flex items-end gap-1 h-32">

          {peakHours.map((count, hour) => (

            <div
              key={hour}
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
                    (Number(count) / maxHourCount) * 100
                  }%`,

                  minHeight:
                    Number(count) > 0
                      ? '4px'
                      : '0px'
                }}
              />

              {hour % 4 === 0 && (

                <span className="text-[10px] text-muted-foreground">
                  {hour}h
                </span>

              )}

            </div>

          ))}

        </div>

      </div>
    </MotionSection>
  )
}