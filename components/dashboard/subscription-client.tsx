"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, CreditCard, ArrowUpRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { PlanSelection } from "@/components/auth/PlanSelection"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { resolveErrorMessage } from "@/lib/errorMessages"
import i18n from "@/lib/i18n"

interface Props {
    currentPlan: string
    isActive: boolean
    renewalDate: string | null
    cancelScheduled: boolean
    messagesUsed: number
    messageLimit: number | null
    productLimit: number | null
    billingMode: string
    productCount: number
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

const TIER_GRADIENT: Record<string, string> = {
    FREE_TRIAL: "from-muted/60 to-muted/20",
    STARTER: "from-blue-500/25 to-blue-500/45",
    PRO: "from-black to-black/5",
    BUSINESS: "from-secondary/25 to-secondary/5",
}

const TIER_BUTTONS_GRADIENT: Record<string, string> = {
    FREE_TRIAL: "bg-gradient-to-r from-muted/80 to-muted/40 border border-border hover:from-muted hover:to-muted/60 hover:border-muted-foreground/40 transition-colors duration-300",
    STARTER: "bg-gradient-to-r from-blue-500/30 to-blue-500/10 border border-blue-400/30 hover:from-blue-500/40 hover:to-blue-500/20 hover:border-blue-400/60 transition-colors duration-300",
    PRO: "bg-gradient-to-r from-muted/30 to-muted/60 border border-muted/30 hover:from-muted/40 hover:to-muted/20 hover:border-muted transition-colors duration-300",
    BUSINESS: "bg-gradient-to-r from-secondary/50 to-secondary/10 border border-secondary/40 hover:from-secondary/40 hover:to-secondary/20 hover:border-secondary/70 transition-colors duration-300",
}

export function SubscriptionClient({
    currentPlan, isActive, renewalDate, cancelScheduled,
    messagesUsed, messageLimit, productLimit, billingMode, productCount
}: Props) {
    const [showPlanSelection, setShowPlanSelection] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const [isPortalLoading, setIsPortalLoading] = useState(false)
    const [isCanceling, setIsCanceling] = useState(false)
    const [isRenewing, setIsRenewing] = useState(false)
    const [localCancelScheduled, setLocalCancelScheduled] = useState(cancelScheduled)
    const [billingModeState, setBillingModeState] = useState(billingMode)
    const router = useRouter()
    const { t } = useTranslation('dashboard')
    const isMonthly = billingMode === 'MONTHLY'

    // console.log('subscription client', { currentPlan, isActive, renewalDate, cancelScheduled, messagesUsed, messageLimit, productLimit, billingMode })

    const formatDateOnly = (value: string | null) => {
        if (!value) return null
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return null
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    }

    const formattedDate = formatDateOnly(renewalDate)
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

    const handleUpgrade = async (selectedPlan: string) => {
        setIsUpgrading(true)
        try {
            const res = await fetch("/api/subscription/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: selectedPlan.toUpperCase(), billingMode: billingModeState })
            })
            const result = await res.json()
            if (result.url) {
                window.location.href = result.url
                return
            }
            if (result.redirect) {
                toast.success(t('subscription.success.subscriptionUpgraded'))
                router.refresh()
                setShowPlanSelection(false)
                setBillingModeState(billingModeState)
                return
            }
            toast.error(resolveErrorMessage(result.error, t))
        } catch {
            setBillingModeState(billingMode)
            toast.error(t('subscription.genericError'))
        } finally {
            setIsUpgrading(false)
        }
    }

    const handlePlanSelect = (plan: string) => {
        void handleUpgrade(plan)
    }

    const handleManageBilling = async () => {
        setIsPortalLoading(true)
        try {
            const res = await fetch("/api/subscription/portal", { method: "POST" })
            const result = await res.json()
            if (result.url) { setTimeout(() => setIsPortalLoading(false), 1000); window.location.href = result.url }
            else {
                toast.error(resolveErrorMessage(result.error, t))
                setIsPortalLoading(false)
            }
        } catch {
            toast.error(t('subscription.genericError'))
            setIsPortalLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!confirm(t('subscription.confirmCancel'))) return
        setIsCanceling(true)
        try {
            const res = await fetch("/api/subscription/cancel", { method: "POST" })
            const result = await res.json()
            if (!result.success) {
                toast.error(resolveErrorMessage(result.error, t)); return
            }
            await pollStatus(true)
            setLocalCancelScheduled(true)
            toast.success(t('subscription.success.subscriptionCancel'))
            router.refresh()
        } catch {
            toast.error(t('subscription.genericError'))
        } finally {
            setIsCanceling(false)
        }
    }

    const handleRenew = async () => {
        if (!confirm(t('subscription.confirmUndoCancel'))) return
        setIsRenewing(true)
        try {
            const res = await fetch("/api/subscription/renew", { method: "POST" })
            const result = await res.json()
            if (!result.success) {
                if (result.error === 'NO_PAYMENT_METHOD') {
                    toast.error(resolveErrorMessage(result.error, t))
                    const res = await fetch('/api/subscription/portal', { method: 'POST' })
                    console.log(res)
                } else {
                    toast.error(resolveErrorMessage(result.error, t))
                }
                return
            }
            await pollStatus(false)
            setLocalCancelScheduled(false)
            toast.success(t('subscription.success.subscriptionRenewed'))
            router.refresh()
        } catch {
            toast.error(t('subscription.genericError'))
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
            if (result.mode === 'ONE_TIME_REVOKED') {
                toast.success(t('subscription.success.oneTimeRevoked'))
                router.refresh()
                return
            }
            if (!result.success) {
                toast.error(resolveErrorMessage(result.error, t))
                return
            }
            toast.success(t('subscription.success.subscriptionEnded'))
            router.refresh()
        } catch {
            toast.error(t('subscription.genericError'))
        } finally {
            setIsCanceling(false)
        }
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
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden rounded-2xl p-8 bg-linear-to-tr ${TIER_GRADIENT[currentPlan] ?? TIER_GRADIENT.FREE_TRIAL} border border-border`}
        >
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {currentPlan === "BUSINESS" && <Sparkles size={18} className="text-secondary" />}
                        <h2 className="text-3xl font-bold text-foreground">{planDisplayName}</h2>
                    </div>
                    <p className="text-sm font-normal">
                        {!isActive
                            ? <span className="text-orange-500 font-medium">{t('subscription.inactive')}</span>
                            : localCancelScheduled
                                ? <span className="text-orange-500 font-medium">{formattedDate ? t('subscription.cancelsOn', { date: formattedDate }) : t('subscription.cancelScheduled')}</span>
                                : <span className="text-muted-foreground">{formattedDate ? t('subscription.renewsOn', { date: formattedDate }) : t('subscription.active')}</span>
                        }
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap ">

                    {/* billing page button */}
                    <button onClick={handleManageBilling} disabled={isPortalLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg  hover:cursor-pointer ${TIER_BUTTONS_GRADIENT[currentPlan] ?? TIER_BUTTONS_GRADIENT.FREE_TRIAL} text-sm font-medium disabled:opacity-50`}>
                        {isPortalLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                        {t('subscription.manageBilling')}
                    </button>

                    {/* undo cancelation */}
                    {isMonthly && localCancelScheduled && isActive && (
                        <button onClick={handleRenew} disabled={isRenewing}
                            className={`px-4 py-2 rounded-lg hover:cursor-pointer hover:opacity-90 ${TIER_BUTTONS_GRADIENT[currentPlan] ?? TIER_BUTTONS_GRADIENT.FREE_TRIAL} text-sm font-medium disabled:opacity-50`}>
                            {isRenewing ? <Loader2 size={16} className="animate-spin" /> : t('subscription.undoCancel')}
                        </button>
                    )}

                    {/* upgrade */}
                    {isActive && (
                        <button onClick={() => setShowPlanSelection(true)} dir={i18n.language === 'ar' ? 'ltr' : 'rtl'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:cursor-pointer ${TIER_BUTTONS_GRADIENT[currentPlan] ?? TIER_BUTTONS_GRADIENT.FREE_TRIAL} text-sm font-medium`}>
                            <ArrowUpRight size={16} />
                            <h3>{t('subscription.upgradePlan')}</h3>
                        </button>
                    )}

                    {/* Cancel button */}
                    {isMonthly && isActive && !localCancelScheduled && (
                        <button onClick={handleCancel} disabled={isCanceling}
                            className={`px-4 py-2 rounded-lg border border-destructive/30
                            
                            bg-gradient-to-r from-destructive/50 to-destructive/80  hover:from-destructive/40 hover:to-destructive/20 hover:cursor-pointer 
                            hover:border-destructive/40
                            
                            text-sm font-medium disabled:opacity-50 transition-colors duration-300`}>
                            {isCanceling ? <Loader2 size={16} className="animate-spin" /> : t('subscription.cancelPlan')}
                        </button>
                    )}

                    {/* end now button */}
                    {isActive && (
                        <button onClick={handleCancelNow} disabled={isCanceling}
                            className="px-4 py-2 rounded-lg border border-destructive/30

                             bg-gradient-to-r from-destructive/50 to-destructive/80  hover:from-destructive/40 hover:to-destructive/20 hover:cursor-pointer hover:border-destructive/40

                             text-sm font-medium disabled:opacity-50 transition-colors duration-300">
                            {isCanceling ? <Loader2 size={16} className="animate-spin" /> : t('subscription.endNow')}
                        </button>
                    )}


                    {/* new plans buttons */}
                    {!isActive && (
                        <>
                            <button onClick={() => { setBillingModeState('ONE_TIME'); setShowPlanSelection(true) }} disabled={isUpgrading}
                                className="px-4 py-2 rounded-lg border border-border

                                                                
                                bg-gradient-to-r from-black/50 to-black/80  hover:from-black/40 hover:to-black/20 hover:cursor-pointer 

                                text-sm font-medium disabled:opacity-50 transition-colors duration-300">
                                {t('subscription.newOneTimePlan')}
                            </button>
                            <button onClick={() => { setBillingModeState('MONTHLY'); setShowPlanSelection(true) }} disabled={isUpgrading}
                                className="px-4 py-2 rounded-lg border border-border

                                                                
                                bg-gradient-to-r from-black/50 to-black/80  hover:from-black/40 hover:to-black/20 hover:cursor-pointer 

                                text-sm font-medium disabled:opacity-50 transition-colors duration-300">
                                {t('subscription.createNewSubscription')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {!isMonthly && isActive && renewalDate && (
                <span className="py-2 text-sm font-medium text-muted-foreground">
                    {t('subscription.oneTimeExpires', { date: formattedDate })}
                </span>
            )}

            <div className="relative flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/60">
                <UsageRing
                    value={isUnlimited ? 0 : usagePercent}
                    label={t('subscription.messages')}
                    sublabel={isUnlimited ? t('subscription.unlimited') : `${messagesUsed} / ${messageLimit}`}
                />
                <UsageRing
                    value={productLimit === null ? 0 : productCount}
                    label={t('subscription.productLimit')}
                    sublabel={productLimit === null ? t('subscription.unlimited') : `${productLimit} max`}
                />
            </div>
        </motion.div>
    )
}