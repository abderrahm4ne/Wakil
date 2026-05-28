"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { SubscriptionCard } from "@/components/ui/subscription-card"
import { PlanSelection } from "@/components/auth/PlanSelection"

interface Props {
    currentPlan: string
    isActive: boolean
    messagesUsed: number
    messagesLimit: number
    renewalDate: string | null
}

export function SubscriptionClient({
    currentPlan,
    isActive,
    messagesUsed,
    messagesLimit,
    renewalDate,
}: Props) {
    const [showPlanSelection, setShowPlanSelection] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const router = useRouter()

    const formattedRenewal = renewalDate
        ? new Date(renewalDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
          })
        : "N/A"

    const planDisplayName =
        currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase().replace("_", " ")

    const handleUpgrade = async (planId: string) => {
        setIsUpgrading(true)
        try {
            const res = await fetch("/api/subscription/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            })
            const result = await res.json()
            if (result.success) {
                setShowPlanSelection(false)
                router.refresh()
            } else {
                alert(result.error || "Failed to upgrade plan")
            }
        } catch {
            alert("An error occurred")
        } finally {
            setIsUpgrading(false)
        }
    }

    const handleRenew = async () => {
        setIsUpgrading(true)
        try {
            const res = await fetch("/api/subscription/renew", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: currentPlan }),
            })
            const result = await res.json()
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error || "Failed to renew plan")
            }
        } catch {
            alert("An error occurred")
        } finally {
            setIsUpgrading(false)
        }
    }

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your plan?")) return
        setIsUpgrading(true)
        try {
            const res = await fetch("/api/subscription/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: currentPlan }),
            })
            const result = await res.json()
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error || "Failed to cancel plan")
            }
        } catch {
            alert("An error occurred")
        } finally {
            setIsUpgrading(false)
        }
    }

    if (!showPlanSelection) {
        return (
            <div className="space-y-6">
                <SubscriptionCard
                    planName={planDisplayName}
                    status={isActive ? "active" : "expired"}
                    messagesUsed={messagesUsed}
                    messagesLimit={messagesLimit}
                    renewalDate={formattedRenewal}
                    onUpgrade={() => setShowPlanSelection(true)}
                    onRenew={handleRenew}
                    onCancel={handleCancel}
                    isLoading={isUpgrading}
                />
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setShowPlanSelection(true)}
                        className="text-[#00D4AA] hover:underline hover:cursor-pointer transition-all"
                    >
                        View all available plans
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Select a new plan</h2>
                <button
                    onClick={() => setShowPlanSelection(false)}
                    className="text-white/70 hover:text-white hover:cursor-pointer hover:underline transition-all"
                >
                    Back to current plan
                </button>
            </div>

            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                {isUpgrading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-[#00D4AA]" />
                        <p className="text-slate-300">Processing your upgrade...</p>
                    </div>
                ) : (
                    <PlanSelection
                        selected={currentPlan}
                        onSelect={handleUpgrade}
                    />
                )}
            </div>
        </div>
    )
}