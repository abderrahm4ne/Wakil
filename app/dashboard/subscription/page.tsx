"use client";

import { useEffect, useState, useCallback } from "react";
import { SubscriptionCard } from "@/components/ui/subscription-card";
import { PlanSelection } from "@/components/auth/PlanSelection";
import { Loader2 } from "lucide-react";

const PLAN_LIMITS: Record<string, number> = {
  FREE_TRIAL: 500,
  STARTER: 2000,
  PRO: 10000,
  BUSINESS: 1000000,
};

const PLAN_MAP: Record<string, string> = {
  "FreeTrial": "FREE_TRIAL",
  "Starter": "STARTER",
  "Pro": "PRO",
  "Business": "BUSINESS",
};

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(true);
    const [bot, setBot] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [showPlanSelection, setShowPlanSelection] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);

    let fetchData: any;
    useEffect(() => {
          fetchData = async () => {
              setLoading(true);
              try {
                  const [botRes, subRes] = await Promise.all([
                      fetch("/api/bot"),
                      fetch("/api/subscription"),
                  ]);

                  const botData = await botRes.json();
                  const subData = await subRes.json();

                  if (botData.success) setBot(botData.data);
                  if (subData.success) setSubscription(subData.data);
              } catch (error) {
                console.error("Failed to fetch subscription data", error);
              } finally {
                setLoading(false);
              }}
            }, []);



    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpgrade = async (planId: string) => {
        setIsUpgrading(true)
        try {
            const res = await fetch("/api/subscription/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId })
            })
            const result = await res.json()
            if (result.success) {
                await fetchData()
                setShowPlanSelection(false)
            } else {
                alert(result.error || "Failed to upgrade plan")
            }
        } catch {
            alert("An error occurred")
        } finally {
            setIsUpgrading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#00D4AA]" />
            </div>
        );
    }

  const currentPlan = subscription?.plan || "FREE_TRIAL";
  const status = subscription?.isActive ? "active" : "expired";
  const messagesUsed = subscription?.messageUsed || 0;
  const messagesLimit = PLAN_LIMITS[currentPlan] || 500;
  const renewalDate = subscription?.endDate
      ? new Date(subscription.endDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
      : "N/A";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
          <p className="text-slate-400">
              Manage your plan, billing, and upgrade options
          </p>
      </div>

      {!showPlanSelection ? (
        <div className="space-y-6">
            <SubscriptionCard
              planName={currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase().replace("_", " ")}
              status={status as any}
              messagesUsed={messagesUsed}
              messagesLimit={messagesLimit}
              renewalDate={renewalDate}
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
      ) : (
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
                      selected={currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase().replace("trial", "Trial")} 
                      onSelect={handleUpgrade} 
                    />
              )}
          </div>
        </div>
      )}
    </div>
  );
}
