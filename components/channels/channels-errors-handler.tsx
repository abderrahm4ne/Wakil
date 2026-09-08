'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const ERROR_TOAST_MAP: Record<string, string> = {
  MISSING_PARAMS: 'channels.errors.missingParams',
  INVALID_PLATFORM: 'channels.errors.invalidPlatform',
  FORBIDDEN: 'channels.errors.forbidden',
  SERVER_ERROR: 'channels.errors.serverError',
  NO_PAGES_FOUND: 'channels.errors.noPages.message',
  NO_INSTAGRAM_ACCOUNT_LINKED: 'channels.errors.noInstagram.message',
  PERMISSION_DENIED: 'channels.errors.permissionDenied.message',
  INVALID_STATE: 'channels.errors.sessionExpired.message',
  TOKEN_EXCHANGE_FAILED: 'channels.errors.connectionFailed.message',
  ACCESS_DENIED: 'channels.errors.accessDenied.message',
  CONNECTION_EXPIRED: 'channels.errors.connectionExpired'
}

export function ChannelErrorToastHandler() {
  const searchParams = useSearchParams()
  const { t } = useTranslation('dashboard')
  const error = searchParams.get('error')

  useEffect(() => {
    if (!error) return

    const messageKey = ERROR_TOAST_MAP[error]
    if (!messageKey) {
      toast.error(t('channels.errors.serverError'))
      return
    }

    if (error === 'PERMISSION_DENIED' || error === 'ACCESS_DENIED') {
      toast.warning(t(messageKey))
    } else if (error === 'SERVER_ERROR') {
      toast.error(t(messageKey))
    } else {
      toast.error(t(messageKey))
    }

    window.history.replaceState({}, '', '/dashboard/channels')
  }, [error, t])

  return null
}