"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PlanSelection } from "@/components/auth/PlanSelection"
import WakilLogo from "@/components/common/WakilLogo"
import { createSubscriptionForCurrentUser } from "@/lib/actions/planSelection"

export default function OnBoardingPlanClient() {
    const [selectedPlan, setSelectedPlan] = useState("Starter")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleConfirm = () => {
        startTransition(async () => {
            const res = await createSubscriptionForCurrentUser(selectedPlan)
            if (res.success) {
                router.push("/dashboard")
            }
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4 py-10">
            <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
                <WakilLogo />

                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-foreground">Choose your plan</h1>
                    <p className="text-muted-foreground">You can change this anytime from billing.</p>
                </div>

                <PlanSelection selected={selectedPlan} onSelect={setSelectedPlan} />

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isPending}
                    className="w-full max-w-xs py-2.5 px-4 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                    {isPending ? "Setting up..." : "Continue"}
                </button>
            </div>
        </div>
    )
}