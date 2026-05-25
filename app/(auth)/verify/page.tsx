'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import WakilLogo from '@/components/common/WakilLogo'
import { X, Check } from 'lucide-react'

type Status = 'loading' | 'success' | 'error'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }

    const verify = async () => {
      const res = await fetch(`/api/auth/verify-email?token=${token}`, {
        redirect: 'manual'
      })

      if (res.status === 0 || res.ok || res.type === 'opaqueredirect') {
        setStatus('success')
        setMessage('Your email has been verified successfully!')
        setTimeout(() => router.push('/login?verified=true'), 3000)
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setMessage(
          data.error === 'INVALID_OR_EXPIRED_TOKEN'
            ? 'This link has expired or already been used.'
            : 'Something went wrong. Please try again.'
        )
      }
    }

    verify()
  }, [token])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="flex flex-col items-center gap-8 max-w-md w-full">

        {/* Logo */}
        <WakilLogo />

        {/* Card */}
        <div className="w-full bg-card border border-border rounded-2xl p-10 flex flex-col items-center gap-6">

          {/* Loading */}
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 rounded-full border-4 border-secondary border-t-transparent animate-spin" />
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Verifying your email</h1>
                <p className="text-muted-foreground">Please wait a moment...</p>
              </div>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <Check className='text-green-600 ' size={74} />
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">You're verified!</h1>
                <p className="text-muted-foreground">{message}</p>
                <p className="text-sm text-muted-foreground">Redirecting to login in 3 seconds...</p>
              </div>
              <Link
                href="/login?verified=true"
                className="w-full text-center py-2.5 px-4 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-colors"
              >
                Sign in now
              </Link>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <X className='text-red-700' size={74}/>
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <div className="w-full flex flex-col gap-3">
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-colors"
                >
                  Register again
                </Link>
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 px-4 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground">© 2026 Wakil. All rights reserved.</p>
      </div>
    </div>
  )
}