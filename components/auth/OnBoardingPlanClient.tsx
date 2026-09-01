"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { PlanSelection } from "@/components/auth/PlanSelection"
import WakilLogo from "@/components/common/WakilLogo"
import { useTranslation } from "react-i18next"
import { toast } from 'sonner'
import { resolveErrorMessage } from "@/lib/errorMessages"



export default function OnBoardingPlanClient() {
    const [selectedPlan, setSelectedPlan] = useState("STARTER")
    const [selectedBillingMode, setSelectedBillingMode] = useState("MONTHLY")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { t, i18n } = useTranslation('auth')


    const BILLING_MODES = [
        { id: 'MONTHLY', label: t('onboarding.monthly'), description: t('onboarding.renewDescription') },
        { id: 'ONE_TIME', label: t('onboarding.oneTime'), description: t('onboarding.oneTimeDescription') }
    ]

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            let rPlan
            if (selectedPlan === 'FreeTrial'){
                rPlan = 'FREE_TRIAL'
            } 
            else {
                rPlan = selectedPlan.toUpperCase()
            }
            const res = await fetch("/api/subscription/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    plan: rPlan, 
                    billingMode: selectedBillingMode 
                })
            })
            const result = await res.json()
            if (result.url) {
                window.location.href = result.url
            } else {
                toast.error(resolveErrorMessage(result.error, t))
            }
        } catch {
            alert(t('onboarding.genericError'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`flex items-center justify-center min-h-screen bg-background px-4 py-10 ${i18n.language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
                <WakilLogo />

                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold text-foreground">{t('onboarding.choosePlan')}</h1>
                    <p className="text-muted-foreground font-semibold">{t('onboarding.changeAnytime')}</p>
                </div>

                {/* Plan Selection */}
                <div className="w-full">
                    <PlanSelection selected={selectedPlan} onSelect={setSelectedPlan} />
                </div>

                {/* Billing Mode Selection */}
                <div className="w-full">
                    <label className="block text-xl font-semibold text-center underline text-foreground mb-3">
                        {t('onboarding.billingMode')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {BILLING_MODES.map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setSelectedBillingMode(mode.id)}
                                className={`p-4 rounded-lg border-2 transition-all ${i18n.language === 'ar' ? 'text-right' : 'text-left'} hover:cursor-pointer
                                    ${selectedBillingMode === mode.id
                                        ? 'border-secondary bg-secondary/5'
                                        : 'border-border hover:border-secondary/50'
                                    }`}
                            >
                                <p className="font-semibold text-foreground">{mode.label}</p>
                                <p className="text-sm font-normal text-muted-foreground mt-1">{mode.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full max-w-xs py-2.5 px-4 rounded-lg bg-secondary text-secondary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 hover:cursor-pointer"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            {t('onboarding.processingCheckout')}
                        </>
                    ) : (
                        t('onboarding.continueToCheckout')
                    )}
                </button>
            </div>
        </div>
    )
}