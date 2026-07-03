"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

interface ConfirmSubmitProps {
    formData: {
        name: string
        email: string
        password: string
        confirmPassword: string
    }
    plan: string
}

export function ConfirmSubmit({ formData, plan }: ConfirmSubmitProps) {
    const { t } = useTranslation(['auth', 'landing'])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const planNames: Record<string, string> = {
        FreeTrial: t('pricing.plans.free.name', { ns: 'landing' }) + " — 0DZD",
        Starter: t('pricing.plans.starter.name', { ns: 'landing' }) + " — 1,500 DZD/mo",
        Pro: t('pricing.plans.pro.name', { ns: 'landing' }) + " — 4,000 DZD/mo",
        Business: t('pricing.plans.business.name', { ns: 'landing' }) + " — 9,000 DZD/mo",
    }

    const handleSubmit = async () => {
        setError(null)

        if (!formData.name || !formData.email || !formData.password) {
            setError(t('register.errors.fillAll'))
            return
        }
        if (formData.password !== formData.confirmPassword) {
            setError(t('register.errors.passwordMismatch'))
            return
        }
        if (formData.password.length < 8) {
            setError(t('register.errors.passwordLength'))
            return
        }

        setIsLoading(true)
        try {
            const prismaPlan = plan.toUpperCase()
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    plan: prismaPlan,
                }),
            })

            const data = await res.json()
            console.log(data)
            if (!data.success) {
                setError(data.error || t('register.errors.somethingWrong'))
                return
            }
            alert(t('register.alerts.success'))
            router.push("/login?registered=true")
        } catch (err){
            console.log(err)
            setError(t('register.errors.somethingWrong'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-full flex flex-col justify-center items-center px-12 ">
            <h2 className="text-3xl font-bold text-white mb-1 font-sans">{t('register.confirmTitle')}</h2>
            <p className="text-muted-foreground text-sm mb-8">{t('register.confirmSubtitle')}</p>

            <div className="space-y-4 w-3/4">
                <div className="p-4 rounded-lg border border-secondary/40 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('register.name')}</span>
                        <span className="text-white text-wrap">{formData.name || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('register.email')}</span>
                        <span className="text-white text-wrap">{formData.email || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('register.password')}</span>
                        <span className="text-white text-wrap">{"•".repeat(formData.password.length) || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="text-white">{planNames[plan] || plan}</span>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-white text-black py-5 hover:cursor-pointer"
                >
                    {isLoading ? t('register.creating') : t('register.submit')}
                </Button>
                <p className="text-center text-sm text-muted-foreground text-nowrap">
<<<<<<< HEAD
                    {t('register.existingAccount') + " "}
                        <a href="/login" className="text-foreground hover:underline">
                        {t('register.signIn')}
=======
                    {"Existing account? "}
                        <a href="/login" className="text-foreground hover:underline">
                        Sign in
>>>>>>> 725af48 ( style: working on home page sections)
                        </a>
                </p>
            </div>
        </div>
    )
}
