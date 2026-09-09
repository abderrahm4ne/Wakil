'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

// Helper to convert SNAKE_CASE url param to camelCase key
const ERROR_KEY_MAP: Record<string, string> = {
  NO_PAGES_FOUND: 'noPages',
  NO_INSTAGRAM_ACCOUNT_LINKED: 'noInstagram',
  PERMISSION_DENIED: 'permissionDenied',
  INVALID_STATE: 'sessionExpired',
  TOKEN_EXCHANGE_FAILED: 'connectionFailed',
  SERVER_ERROR: 'serverError',
}

export function ChannelErrorToastHandler() {
  const searchParams = useSearchParams()
  const { t } = useTranslation('dashboard')
  const error = searchParams.get('error')

  useEffect(() => {
    if (!error) return

    const mappedKey = ERROR_KEY_MAP[error] || 'serverError'
    const message = t(`channels.errors.${mappedKey}.message`, {
      defaultValue: t('channels.errors.serverError.message')
    })

    toast.error(message)

    window.history.replaceState({}, '', '/dashboard/channels')
  }, [error, t])

  return null
}