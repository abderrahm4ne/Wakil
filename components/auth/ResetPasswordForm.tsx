"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye } from "lucide-react"
import { useTranslation } from "react-i18next"

export function ResetPasswordForm() {
    const { t } = useTranslation('auth')
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const inputType = showPassword ? 'text' : 'password'

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (!token) {
            setError(t('resetPassword.errors.invalidToken'))
            return
        }
        if (password.length < 8) {
            setError(t('resetPassword.errors.tooShort'))
            return
        }
        if (password !== confirmPassword) {
            setError(t('resetPassword.errors.mismatch'))
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })
            const data = await res.json()

            if (!data.success) {
                setError(
                    data.error === 'INVALID_OR_EXPIRED_TOKEN'
                        ? t('resetPassword.errors.expiredToken')
                        : t('resetPassword.errors.serverError')
                )
                setIsLoading(false)
                return
            }

            setSuccess(true)
            setTimeout(() => router.push('/login?reset=true'), 2000)
        } catch {
            setError(t('resetPassword.errors.serverError'))
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="space-y-4 lg:w-[45%] w-[80%] font-sans text-center">
                <p className="text-red-500/70 text-sm" suppressHydrationWarning>
                    {t('resetPassword.errors.invalidToken')}
                </p>
                <a href="/forgot-password" className="text-secondary text-sm hover:underline">
                    {t('resetPassword.requestNew')}
                </a>
            </div>
        )
    }

    if (success) {
        return (
            <div className="space-y-4 lg:w-[45%] w-[80%] font-sans text-center">
                <p className="text-green-500 text-sm" suppressHydrationWarning>
                    {t('resetPassword.successMessage')}
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-7 lg:w-[45%] w-[80%] font-sans">
            <div className="flex flex-col space-y-3">
                <div className="space-y-2 relative">
                    <Label htmlFor="password" className="text-foreground">
                        {t('resetPassword.newPassword')}
                    </Label>
                    <Input
                        id="password"
                        type={inputType}
                        placeholder={t('resetPassword.newPasswordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent border-border"
                    />
                    {showPassword ? (
                        <button type="button" onClick={() => setShowPassword(s => !s)}>
                            <EyeOff size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer" />
                        </button>
                    ) : (
                        <button type="button" onClick={() => setShowPassword(s => !s)}>
                            <Eye size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer" />
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">
                        {t('resetPassword.confirmPassword')}
                    </Label>
                    <Input
                        id="confirmPassword"
                        type={inputType}
                        placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-transparent border-border"
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <Button type="submit" className="w-full bg-primary text-black py-4.5 hover:cursor-pointer" disabled={isLoading}>
                    {isLoading ? t('resetPassword.resetting') : t('resetPassword.resetButton')}
                </Button>
            </div>

            {error && (
                <p className="text-red-500/70 text-sm text-center">{error}</p>
            )}
        </form>
    )
}