'use client'

import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type ChannelType = 'INSTAGRAM' | 'FACEBOOK'

interface Page {
  id: string
  name: string
  hasInstagram?: boolean
}

interface ConnectSuccessSheetProps {
  platform: ChannelType
  pages: Page[]
  connectionId: string
}

export function ConnectSuccessSheet({
  platform,
  pages,
  connectionId
}: ConnectSuccessSheetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t, i18n } = useTranslation('dashboard')

  const handleContinue = () => {
    router.push(
      `/dashboard/channels/select?connection=${connectionId}`
    )
  }

  const handlePickDifferent = () => {
    router.push('/dashboard/channels')
  }

  const instagramLinkedCount = pages.filter(p => p.hasInstagram).length
  const showInstagramWarning = platform === 'INSTAGRAM' && instagramLinkedCount === 0

  return (
    <div className={`min-h-[80vh] bg-background flex items-center justify-center p-4 ${i18n.language === 'ar' ? 'font-arabic' : 'font-display'}`}>
      <div className="w-full max-w-md space-y-6">

        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t('channels.success.title')}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            {t('channels.success.subtitle', { count: pages.length })}
          </p>
        </div>

        {/* Pages List */}
        <div className="space-y-2 border border-border rounded-lg p-4 bg-card/50 max-h-64 overflow-y-auto">
          {pages.map((page) => (
            <div
              key={page.id}
              className="p-3 rounded-lg bg-background border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* DOT */}
                <div className="mt-1">
                  <div className="h-4 w-4 rounded-full border-2 border-secondary" />
                </div>

                <div className="flex-1 min-w-0">

                  {/* page name */}
                  <p className="font-medium text-foreground text-md truncate">
                    {page.name}
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    {t('channels.success.pageId')}: {page.id}
                  </p>

                  {platform === 'INSTAGRAM' && !page.hasInstagram && (
                    <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {t('channels.success.noInstagramLinked')}
                    </p>
                  )}

                  {platform === 'INSTAGRAM' && page.hasInstagram && (
                    <p className="text-sm text-green-600 mt-1">
                      {t('channels.success.instagramLinked')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Warning */}
        {showInstagramWarning && (
          <div className="flex gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>{t('channels.success.instagramWarning')}</p>
          </div>
        )}

        {/* Info */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-200">
          <p>{t('channels.success.info')}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 ">
          <Button
            onClick={handlePickDifferent}
            variant="outline"
            className="flex-1 hover:cursor-pointer py-5"
            disabled={isLoading}
          >
            {t('channels.success.cancelBtn')}
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:cursor-pointer py-5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('loading')}
              </>
            ) : (
              t('channels.success.continueBtn')
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}