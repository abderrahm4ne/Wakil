"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation"

import { EyeOff, Eye } from "lucide-react"
import { validateLogin } from "@/app/action/login"
import { useTranslation } from "react-i18next"

export function LoginForm() {
    const { t } = useTranslation('auth')
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [emailSent, setEmailSent] = useState<string | null>('')
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPassword ? 'text' : 'password'

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      try {
          e.preventDefault()
          setIsLoading(true)
          if (email.trim() === "" || password.trim() === ""){
            setError(t('login.errors.fillFields'));
            setIsLoading(false)
            return
          }
          const check = await validateLogin(email, password);
          if (check.error === "USER_NOT_FOUND"){
            setError(t('login.errors.wrongCredentials'))
            setIsLoading(false)
            return
          }

          if (check.error === "EMAIL_NOT_VERIFIED"){
            setError(t('login.errors.notVerified'))
            setIsLoading(false)
            return
          }

          const res = await signIn('credentials', {
            email,
            password,
            redirect: false
          })
          if (res?.error) {
              setError(t('login.errors.wrongCredentials'))
              setIsLoading(false)
              return
          }
          router.push('/dashboard')
          setIsLoading(false)
        } catch (error) {
          console.log(error)
      }
    }

    const handleResendVerification = async () => {
      setError('')
        const res = await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (data.error === 'RATE_LIMITED') {
            setError(t('login.errors.rateLimited'))
            return
        }
        if (data.error === 'EMAIL_ALREADY_VERIFIED') {
            setError(t('login.errors.alreadyVerified'))
            return
        }
        setEmailSent(t('login.emailSent'))
    }
  return (
    <form onSubmit={(e) => (handleSubmit(e))} className="space-y-7 lg:w-[45%] w-[80%] font-sans">
      <div className="flex flex-col space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              {t('login.email')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('login.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-border "
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-foreground ">
              {t('login.password')}
            </Label>
            <Input
              id="password"
              type={inputType}
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-border "
            />
            {showPassword ? (
                <button type="button" onClick={() => setShowPassword(s => !s)}><EyeOff size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer"/></button>
              ) : (
                <button type="button" onClick={() => setShowPassword(s => !s)}><Eye size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer"/></button>
              )}
            
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              {t('login.forgotPassword')}
            </a>
          </div>
      </div>

      <div className="flex flex-col space-y-2">
          <Button type="submit" className="w-full bg-primary text-black py-4.5" disabled={isLoading}>
            {isLoading ? t('login.signingIn') : t('login.signIn')}
          </Button>
          <p className="text-center text-sm text-muted-foreground text-nowrap">
              {t('login.noAccount') + " "}
                <a href="/register" className="text-foreground hover:underline">
                  {t('login.signUp')}
                </a>
          </p>
      </div>

      {error && (
          <div className="text-center space-y-2">
              <p className="text-red-500/70 text-sm">{error}</p>
                  {error === t('login.errors.notVerified') && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      className="text-secondary text-sm hover:underline"
                    >
                        {t('login.resendVerification')}
                    </button>
              )}
          </div>
      )}
      {emailSent && (
        <p className="text-green-500 text-md text-center font-sans">
          {emailSent}
        </p>
      )}

      
    </form>
  )
}
