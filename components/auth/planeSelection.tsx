'user client'
import { Check } from "lucide-react"

export function planeSelection(){

const PRICING_TIERS = [
    {
        name: "Free trial",
        price: "0",
        description: "Perfect for getting started",
        features: ["Up to 500 DMs/free trial period", "Basic analytics"],
    },
    {
        name: "Starter",
        price: "1500",
        description: "Perfect for getting started",
        features: ["Up to 2000 DMs/month", "Basic analytics", "Email support"],
    },
    {
        name: "Pro",
        price: "4000",
        description: "For growing businesses",
        features: ["Up to 10k DMs/month", "Advanced analytics", "Priority support"],
        popular: true,
    },
    {
        name: "Business",
        price: "9000",
        description: "For large scale",
        features: ["Unlimited DMs", "Custom integrations", "24/7 support"],
    },
]
    return(
        <div>
            <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                Choose your plan
                </h3>
                <div className="grid grid-cols-1 gap-3">
                {PRICING_TIERS.map((tier) => (
                    <div
                    key={tier.name}
                    className={`relative rounded-lg border p-4 transition-all ${
                        tier.popular
                        ? "border-emerald-600 bg-emerald-600/10"
                        : "border-border bg-secondary/40"
                    }`}
                    >
                    {tier.popular && (
                        <div className="absolute -top-2 left-4">
                        <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Popular
                        </span>
                        </div>
                    )}

                    <div className="flex items-start justify-between mb-3 pt-2">
                        <div>
                        <h4 className="font-semibold text-foreground text-sm">
                            {tier.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            {tier.description}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                            {tier.price} <span className="text-xs text-muted-foreground">DZD</span>
                        </p>
                        </div>
                    </div>

                    <ul className="space-y-2">
                        {tier.features.map((feature) => (
                        <li
                            key={feature}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                            <Check className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                            {feature}
                        </li>
                        ))}
                    </ul>
                    </div>
                ))}
            </div>
        </div>
        </div>
    )
}