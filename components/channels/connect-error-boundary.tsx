'use client'

import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

const ERROR_MAP: Record<string, { title: string; message: string; action?: string }> = {
  NO_PAGES_FOUND: {
    title: 'No Pages Found',
    message:
      'We couldn\'t find any business pages linked to your account. Make sure you\'re logged in as a Business Manager and have permission to manage pages.'
  },
  NO_INSTAGRAM_ACCOUNT_LINKED: {
    title: 'Instagram Not Linked',
    message:
      'This page doesn\'t have an Instagram business account connected. Go to your Facebook Page settings and link an Instagram account first.'
  },
  PERMISSION_DENIED: {
    title: 'Permissions Denied',
    message:
      'You declined the required permissions. Wakil needs permission to read and send messages to automate your customer replies. Please try again and approve all permissions.'
  },
  INVALID_STATE: {
    title: 'Session Expired',
    message: 'Your session expired. Please go back and try connecting again.'
  },
  TOKEN_EXCHANGE_FAILED: {
    title: 'Connection Failed',
    message:
      'We couldn\'t complete the connection. This might be a temporary issue. Please try again.'
  },
  ACCESS_DENIED: {
    title: 'Access Denied',
    message:
      'You don\'t have permission to manage this page. Make sure you\'re logged in with the correct account.'
  },
  SERVER_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support.'
  }
}

export function ChannelConnectErrorBoundary() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as string | null

  const errorConfig = error ? ERROR_MAP[error] : null

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
            Error code: {error}
          </p>
        </div>

        {/* Next Steps */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-200 font-medium mb-2">What to do:</p>
          <ul className="text-xs text-blue-200/80 space-y-1 list-disc list-inside">
            {error === 'NO_INSTAGRAM_ACCOUNT_LINKED' && (
              <>
                <li>Open your Facebook Page settings</li>
                <li>Go to Instagram settings</li>
                <li>Link your Instagram business account</li>
                <li>Come back and try connecting again</li>
              </>
            )}
            {error === 'NO_PAGES_FOUND' && (
              <>
                <li>Make sure you're logged into the right Meta account</li>
                <li>Verify you have admin access to a business page</li>
                <li>Try again or contact Meta support</li>
              </>
            )}
            {error === 'PERMISSION_DENIED' && (
              <>
                <li>Go back and click "Connect" again</li>
                <li>Check all permissions boxes when prompted</li>
                <li>Complete the authorization flow</li>
              </>
            )}
            {error === 'INVALID_STATE' && (
              <>
                <li>Go back to the channels page</li>
                <li>Click "Connect" to start fresh</li>
                <li>Complete the authorization within 10 minutes</li>
              </>
            )}
            {(error === 'TOKEN_EXCHANGE_FAILED' || error === 'SERVER_ERROR') && (
              <>
                <li>Check your internet connection</li>
                <li>Try connecting again</li>
                <li>If the issue persists, contact support</li>
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
            Go Back
          </Button>
          <Button
            onClick={handleRetry}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Try Again
          </Button>
        </div>

        {/* Support */}
        <p className="text-center text-xs text-muted-foreground">
          Still having trouble?{' '}
          <a href="mailto:support@wakil.app" className="text-secondary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}