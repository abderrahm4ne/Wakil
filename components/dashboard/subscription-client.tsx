"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, CreditCard, ArrowUpRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { PlanSelection } from "@/components/auth/PlanSelection"
import { useTranslation } from "react-i18next"

interface Props {
    currentPlan: string
    isActive: boolean
    renewalDate: string | null
    cancelScheduled: boolean
    messagesUsed: number
    messageLimit: number | null
    productLimit: number | null
    billingMode: string
}

function UsageRing({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
    const radius = 42
    const circumference = 2 * Math.PI * radius
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const t = setTimeout(() => setProgress(value), 100)
        return () => clearTimeout(t)
    }, [value])

    const offset = circumference - (progress / 100) * circumference
    const color = value >= 90 ? "#f97316" : value >= 70 ? "#eab308" : "#00D4AA"

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                    <motion.circle
                        cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-foreground">{Math.round(value)}%</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sublabel}</p>
            </div>
        </div>
    )
}

const TIER_ORDER = ["FREE_TRIAL", "STARTER", "PRO", "BUSINESS"]
const TIER_HEIGHT: Record<string, string> = {
    FREE_TRIAL: "h-40", STARTER: "h-48", PRO: "h-56", BUSINESS: "h-64",
}
const TIER_GRADIENT: Record<string, string> = {
    FREE_TRIAL: "from-muted/90s to-muted/50",
    STARTER: "from-blue-400/20 to-blue-500/5",
    PRO: "from-black to-card/50",
    BUSINESS: "from-secondary/10 via-secondary/20 to-transparent",
}

export function SubscriptionClient({
    currentPlan, isActive, renewalDate, cancelScheduled,
    messagesUsed, messageLimit, productLimit, billingMode
}: Props) {
    const [showPlanSelection, setShowPlanSelection] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const [isPortalLoading, setIsPortalLoading] = useState(false)
    const [isCanceling, setIsCanceling] = useState(false)
    const [isRenewing, setIsRenewing] = useState(false)
    const [localCancelScheduled, setLocalCancelScheduled] = useState(cancelScheduled)
    const router = useRouter()
    const { t } = useTranslation('dashboard')
    const isMonthly = billingMode === 'MONTHLY'

    const formattedDate = renewalDate
        ? new Date(renewalDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : null

    const planDisplayName = currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase().replace("_", " ")
    const isUnlimited = messageLimit === null
    const usagePercent = isUnlimited ? 0 : Math.min((messagesUsed / messageLimit) * 100, 100)

    async function pollStatus(expectCancel: boolean) {
        for (let i = 0; i < 5; i++) {
            await new Promise(r => setTimeout(r, 1000))
            const res = await fetch('/api/subscription/status')
            const { data } = await res.json()
            if (!!data?.cancelScheduled === expectCancel) break
        }
    }

    const handleUpgrade = async (selectedPlan: string, selectedBillingMode: string) => {
        setIsUpgrading(true)
        try {
            const res = await fetch("/api/subscription/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: selectedPlan, billingMode: selectedBillingMode })
            })
            const result = await res.json()
            if (result.url) {
                window.location.href = result.url
            } else {
                alert(result.error || t('subscription.upgradeFailed'))
            }
        } catch {
            alert(t('subscription.genericError'))
        } finally {
            setIsUpgrading(false)
        }
    }

    const handlePlanSelect = (plan: string) => {
        void handleUpgrade(plan, billingMode)
    }

    const handleManageBilling = async () => {
        setIsPortalLoading(true)
        try {
            const res = await fetch("/api/subscription/portal", { method: "POST" })
            const result = await res.json()
            if (result.url) window.location.href = result.url
            else { alert(result.error || t('subscription.portalFailed')); setIsPortalLoading(false) }
        } catch { alert(t('subscription.genericError')); setIsPortalLoading(false) }
    }

    const handleCancel = async () => {
        if (!confirm(t('subscription.confirmCancel'))) return
        setIsCanceling(true)
        try {
            const res = await fetch("/api/subscription/cancel", { method: "POST" })
            const result = await res.json()
            if (!result.success) { alert(result.error || t('subscription.cancelFailed')); return }
            await pollStatus(true)
            setLocalCancelScheduled(true)
            router.refresh()
        } catch { alert(t('subscription.genericError')) }
        finally { setIsCanceling(false) }
    }

    const handleRenew = async () => {
        setIsRenewing(true)
        try {
            const res = await fetch("/api/subscription/renew", { method: "POST" })
            const result = await res.json()
            if (!result.success) {
                if (result.error === 'NO_PAYMENT_METHOD') {
                    window.location.href = '/api/subscription/portal'
                } else {
                    alert(result.error || t('subscription.renewFailed'))
                }
                return
            }
            await pollStatus(false)
            setLocalCancelScheduled(false)
            router.refresh()
        } catch {
            alert(t('subscription.genericError'))
        } finally {
            setIsRenewing(false)
        }
    }

    const handleCancelNow = async () => {
        if (!confirm(t('subscription.confirmCancelNow'))) return
        setIsCanceling(true)
        try {
            const res = await fetch("/api/subscription/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ immediate: true })
            })
            const result = await res.json()
            if (!result.success) { alert(result.error || t('subscription.cancelFailed')); return }
            router.refresh()
        } catch { alert(t('subscription.genericError')) }
        finally { setIsCanceling(false) }
    }

    if (showPlanSelection) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-foreground">{t('subscription.selectNewPlan')}</h2>
                    <button onClick={() => setShowPlanSelection(false)} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                        {t('subscription.backToCurrent')}
                    </button>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                    {isUpgrading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
                            <p className="text-muted-foreground">{t('subscription.processingUpgrade')}</p>
                        </div>
                    ) : (
                        <PlanSelection selected={currentPlan} onSelect={handlePlanSelect} />
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Subscription card */}

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden rounded-2xl p-8 bg-linear-to-tr ${TIER_GRADIENT[currentPlan] ?? TIER_GRADIENT.FREE_TRIAL} border border-border`}
            >

                {/* Subscription card Upper */}

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 ">

                    <div className="space-y-2">

                        {/* Current plan display */}
                        <div className="flex items-center gap-2">
                            {currentPlan === "BUSINESS" && <Sparkles size={18} className="text-secondary" />}
                            <h2 className="text-3xl font-bold text-foreground">{planDisplayName}</h2>
                        </div>

                        {/* Renew dates */}
                        <p className="text-sm font-normal">
                            {!isActive
                                ? <span className="text-orange-500 font-medium">{t('subscription.inactive')}</span>
                                : localCancelScheduled
                                    ? <span className="text-orange-500 font-medium">{formattedDate ? t('subscription.cancelsOn', { date: formattedDate }) : t('subscription.cancelScheduled')}</span>
                                    : <span className="text-muted-foreground">{formattedDate ? t('subscription.renewsOn', { date: formattedDate }) : t('subscription.active')}</span>
                            }
                        </p>
                    </div>

                            {/* Renew, Cancel, billing buttons */}
                            <div className="flex items-center gap-2 flex-wrap">

                            <button onClick={handleManageBilling} disabled={isPortalLoading}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:cursor-pointer hover:border-secondary/50 text-sm font-medium disabled:opacity-50">
                                {isPortalLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                                {t('subscription.manageBilling')}
                            </button>


                            {/* monthly renewal button */}
                            {isMonthly && localCancelScheduled && isActive && (
                                <button onClick={handleRenew} disabled={isRenewing}
                                    className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:cursor-pointer hover:opacity-90 text-sm font-medium disabled:opacity-50">
                                    {isRenewing ? <Loader2 size={16} className="animate-spin" /> : t('subscription.undoCancel')}
                                </button>
                            )}

                            {/* one time sub */}
                            {!isMonthly && !isActive && (
                                <span className="px-4 py-2 text-sm font-medium text-muted-foreground">
                                    {t('subscription.oneTimeExpires', { date: renewalDate })}
                                </span>
                            )}
                            

                            {/* upgrade button */}
                            {isActive && (
                                <button onClick={() => setShowPlanSelection(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 text-secondary-foreground hover:cursor-pointer hover:bg-secondary/60 text-sm font-medium">
                                    <ArrowUpRight size={16} />
                                    {t('subscription.upgradePlan')}
                                </button>
                            )}

                            {/* cancelation button */}
                            {isMonthly && isActive && !localCancelScheduled && (
                                <button onClick={handleCancel} disabled={isCanceling}
                                    className="px-4 py-2 rounded-lg border border-border hover:border-red-500/50 hover:text-destructive hover:cursor-pointer text-sm font-medium disabled:opacity-50">
                                    {isCanceling ? <Loader2 size={16} className="animate-spin" /> : t('subscription.cancelPlan')}
                                </button>
                            )}

                            {/* end now — distinct from scheduled cancel */}
                            {isMonthly && isActive && !localCancelScheduled && (
                                <button onClick={handleCancelNow} disabled={isCanceling}
                                    className="px-4 py-2 rounded-lg border border-border hover:border-red-500/50 hover:text-destructive hover:cursor-pointer text-sm font-medium disabled:opacity-50">
                                    {isCanceling ? <Loader2 size={16} className="animate-spin" /> : t('subscription.endNow')}
                                </button>
                            )}
                        </div>
                    
                </div>

                {/* Usage rings */}
                <div className="relative flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/50">
                    <UsageRing
                        value={isUnlimited ? 0 : usagePercent}
                        label={t('subscription.messages')}
                        sublabel={isUnlimited ? t('subscription.unlimited') : `${messagesUsed} / ${messageLimit}`}
                    />
                    <UsageRing
                        value={productLimit === null ? 0 : 0}
                        label={t('subscription.productLimit')}
                        sublabel={productLimit === null ? t('subscription.unlimited') : `${productLimit} max`}
                    />
                </div>
            </motion.div>


        </>
    )
}