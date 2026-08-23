"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"

export function ForgotPasswordForm() {
    const { t } = useTranslation('auth')
    const [email, setEmail] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        if (email.trim() === "") {
            setError(t('forgotPassword.errors.fillEmail'))
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/forget-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (data.error === 'RATE_LIMITED') {
                setError(t('forgotPassword.errors.rateLimited'))
                setIsLoading(false)
                return
            }
            setSent(true)
        } catch {
            setError(t('forgotPassword.errors.serverError'))
        }
        setIsLoading(false)
    }

    if (sent) {
        return (
            <div className="space-y-5 lg:w-[45%] w-[80%] font-sans text-center">
                <p className="text-foreground text-sm" suppressHydrationWarning>
                    {t('forgotPassword.sentMessage', { email })}
                </p>
                <a href="/login" className="text-secondary text-sm hover:underline">
                    {t('forgotPassword.backToLogin')}
                </a>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-7 lg:w-[45%] w-[80%] font-sans">
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
                        className="bg-transparent border-border"
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <Button type="submit" className="w-full bg-primary text-black py-4.5 hover:cursor-pointer" disabled={isLoading}>
                    {isLoading ? t('forgotPassword.sending') : t('forgotPassword.sendLink')}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                    <a href="/login" className="text-foreground hover:underline">
                        {t('forgotPassword.backToLogin')}
                    </a>
                </p>
            </div>

            {error && (
                <p className="text-red-500/70 text-sm text-center">{error}</p>
            )}
        </form>
    )
}