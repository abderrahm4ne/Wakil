"use client"

const plans = [
    {
        id: "STARTER",
        name: "Starter",
        price: 1500,
        description: "Perfect for getting started",
        features: ["2000 DMs/month", "Rule-based bot", "Basic analytics", "Email support"],
        popular: false,
    },
    {
        id: "PRO",
        name: "Pro",
        price: 4000,
        description: "For growing businesses",
        features: ["10,000 DMs/month", "AI-powered bot", "Advanced analytics", "Priority support"],
        popular: true,
    },
    {
        id: "BUSINESS",
        name: "Business",
        price: 9000,
        description: "For large scale operations",
        features: ["Unlimited DMs", "AI-powered bot", "Full analytics", "24/7 support"],
        popular: false,
    },
]

interface PlanSelectionProps {
    selected: string
    onSelect: (plan: string) => void
}

export function PlanSelection({ selected, onSelect }: PlanSelectionProps) {
    return (
      <>
      2
      </>
    )
}