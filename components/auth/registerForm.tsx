"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

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

export function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [onPlanSection, setOnPlanSection] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>('Free trial')

  const containerRef = useRef<HTMLDivElement>(null)
  const formSectionRef = useRef<HTMLDivElement>(null)
  const planSectionRef = useRef<HTMLDivElement>(null)

  const scrollToPlans = () => {
    planSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    setOnPlanSection(true)
  }

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    setOnPlanSection(false)
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">

      <div className="w-full h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Form */}
        <div
          ref={formSectionRef}
          className="w-full h-full flex flex-col justify-center items-center md:space-y-10 space-y-7 py-7"
        >
          <div className="flex flex-col items-start sm:w-[45%] space-y-2">
            <h1 className="font-bold md:text-3xl text-xl font-sans tracking-tight text-nowrap">
              Get started
            </h1>
            <h3 className="font-semibold md:text-md text-xs text-muted-foreground tracking-tight text-nowrap">
              Create your account and choose your plan
            </h3>
          </div>

          <form className="space-y-6 sm:w-[45%]">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-transparent border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-transparent border-border"
              />
            </div>

            <Button type="submit" className="w-full text-black" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-foreground hover:underline">Sign in</a>
            </p>
          </form>
        </div>

        {/* Plan selection */}
        <div
          ref={planSectionRef}
          className="w-full h-full flex flex-col justify-center items-center py-7 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="sm:w-[65%] w-full space-y-4">
            <div className="space-y-1 place-self-center">
              <h2 className="font-bold md:text-3xl text-xl font-sans tracking-tight">Choose your plan</h2>
              <p className="text-xs text-muted-foreground">Pick the plan that works best for you</p>
            </div>

            <div className="grid grid-cols-2 gap-3 ">
              {PRICING_TIERS.map((tier) => {
                const isSelected = selectedPlan === tier.name
                return (
                <div
                    key={tier.name}
                    onClick={() => setSelectedPlan(tier.name)}
                    className="relative rounded-lg border px-7 py-5 transition-all duration-200 cursor-pointer"
                    style={{
                        backgroundColor: isSelected 
                            ? 'var(--accent)' 
                            : 'rgba(0,212,170,0.1)',
                        borderColor: isSelected 
                            ? '#02a5c2' 
                            : 'var(--border)',
                    }}
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
                      <h4 className="font-semibold text-foreground text-sm">{tier.name}</h4>
                      <p className="text-xs text-muted-foreground">{tier.description}</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {tier.price} <span className="text-xs text-muted-foreground">DZD</span>
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground ">
                        <Check className="h-3 w-3 text-emerald-600 " />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>)
              })}
            </div>
          </div>
        </div>

      </div>

      {/* toggle button*/}
      <button
        onClick={onPlanSection ? scrollToForm : scrollToPlans}
        className="absolute bottom-6 right-6 bg flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors z-10 hover:cursor-pointer"
      >
        {onPlanSection ? (
          <>
            Back to form
            <ChevronUp className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            Choose a plan
            <ChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  )
}