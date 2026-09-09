'use client'

import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

// In connect-error-boundary.tsx
const ERROR_KEY_MAP: Record<string, string> = {
  NO_PAGES_FOUND: 'noPages',
  NO_INSTAGRAM_ACCOUNT_LINKED: 'noInstagram',
  PERMISSION_DENIED: 'permissionDenied',
  INVALID_STATE: 'sessionExpired',
  TOKEN_EXCHANGE_FAILED: 'connectionFailed',
  SERVER_ERROR: 'serverError',
}

export function ChannelConnectErrorBoundary() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation('dashboard')
  const error = searchParams.get('error') as string | null

  const mappedKey = error ? (ERROR_KEY_MAP[error] || 'serverError') : null

  const errorConfig = mappedKey ? {
    title: t(`channels.errors.${mappedKey}.title`),
    message: t(`channels.errors.${mappedKey}.message`)
  } : null

  if (!errorConfig) {
    return null
  }

  const handleRetry = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/dashboard/channels')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Error Icon */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            {errorConfig.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {errorConfig.message}
          </p>
        </div>

        {/* Error Details */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs font-mono text-muted-foreground">
            {t('channels.errors.errorCode')}: {error}
          </p>
        </div>

        {/* Next Steps */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-200 font-medium mb-2">{t('channels.errors.whatToDo')}:</p>
          <ul className="text-xs text-blue-200/80 space-y-1 list-disc list-inside">
            {error === 'NO_INSTAGRAM_ACCOUNT_LINKED' && (
              <>
                <li>{t('channels.errors.steps.noInstagram.step1')}</li>
                <li>{t('channels.errors.steps.noInstagram.step2')}</li>
                <li>{t('channels.errors.steps.noInstagram.step3')}</li>
                <li>{t('channels.errors.steps.noInstagram.step4')}</li>
              </>
            )}
            {error === 'NO_PAGES_FOUND' && (
              <>
                <li>{t('channels.errors.steps.noPages.step1')}</li>
                <li>{t('channels.errors.steps.noPages.step2')}</li>
                <li>{t('channels.errors.steps.noPages.step3')}</li>
              </>
            )}
            {error === 'PERMISSION_DENIED' && (
              <>
                <li>{t('channels.errors.steps.permission.step1')}</li>
                <li>{t('channels.errors.steps.permission.step2')}</li>
                <li>{t('channels.errors.steps.permission.step3')}</li>
              </>
            )}
            {error === 'INVALID_STATE' && (
              <>
                <li>{t('channels.errors.steps.session.step1')}</li>
                <li>{t('channels.errors.steps.session.step2')}</li>
                <li>{t('channels.errors.steps.session.step3')}</li>
              </>
            )}
            {(error === 'TOKEN_EXCHANGE_FAILED' || error === 'SERVER_ERROR') && (
              <>
                <li>{t('channels.errors.steps.server.step1')}</li>
                <li>{t('channels.errors.steps.server.step2')}</li>
                <li>{t('channels.errors.steps.server.step3')}</li>
              </>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('channels.errors.goBack')}
          </Button>
          <Button
            onClick={handleRetry}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {t('channels.errors.tryAgain')}
          </Button>
        </div>

        {/* Support */}
        <p className="text-center text-xs text-muted-foreground">
          {t('channels.errors.support')}{' '}
          <a href="mailto:support@wakil.app" className="text-secondary hover:underline">
            {t('contact')}
          </a>
        </p>
      </div>
    </div>
  )
}