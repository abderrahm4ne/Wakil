'use client'

import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

  const handleContinue = () => {
    // Redirect to page picker with connection ID
    router.push(
      `/dashboard/channels/select?connection=${connectionId}`
    )
  }

  const handlePickDifferent = () => {
    // Go back to channel selection
    router.push('/dashboard/channels')
  }

  const instagramLinkedCount = pages.filter(p => p.hasInstagram).length
  const showInstagramWarning = platform === 'INSTAGRAM' && instagramLinkedCount === 0

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Connected Successfully
          </h1>
          <p className="text-sm text-muted-foreground">
            Found {pages.length} {pages.length === 1 ? 'page' : 'pages'} on your account
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
                <div className="mt-1">
                  <div className="h-4 w-4 rounded-full border-2 border-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {page.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    ID: {page.id}
                  </p>
                  {platform === 'INSTAGRAM' && !page.hasInstagram && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      No Instagram account linked
                    </p>
                  )}
                  {platform === 'INSTAGRAM' && page.hasInstagram && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Instagram business account linked
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Warning */}
        {showInstagramWarning && (
          <div className="flex gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              None of your pages have Instagram linked. Connect an Instagram business account
              in your Facebook Business Manager first.
            </p>
          </div>
        )}

        {/* Info */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
          <p>
            Next, select which {platform === 'INSTAGRAM' ? 'page' : 'page'} you want to connect
            to Wakil for automated messaging.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handlePickDifferent}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Continue to Page Selection'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}