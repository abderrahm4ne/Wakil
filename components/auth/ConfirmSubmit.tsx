"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const planNames: Record<string, string> = {
    FreeTrial: "Free Trial — 0DZD",
    Starter: "Starter — 1,500 DZD/mo",
    Pro: "Pro — 4,000 DZD/mo",
    Business: "Business — 9,000 DZD/mo",
}

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
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async () => {
        setError(null)

        if (!formData.name || !formData.email || !formData.password) {
            setError("Please go back and fill all fields")
            return
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters")
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
                setError(data.error || "Something went wrong")
                return
            }
            alert("A verification email has been sent to your email, verify your email and login")
            router.push("/login?registered=true")
        } catch (err){
            console.log(err)
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-full flex flex-col justify-center items-center px-12 ">
            <h2 className="text-3xl font-bold text-white mb-1 font-sans">Confirm & Create</h2>
            <p className="text-muted-foreground text-sm mb-8">Review your information before submitting</p>

            <div className="space-y-4 w-3/4">
                <div className="p-4 rounded-lg border border-secondary/40 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Name</span>
                        <span className="text-white text-wrap">{formData.name || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span className="text-white text-wrap">{formData.email || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Password</span>
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
                    {isLoading ? "Creating account..." : "Create account"}
                </Button>
                <p className="text-center text-sm text-muted-foreground text-nowrap">
                    {"Existing account? "}
                        <a href="/login" className="text-foreground hover:underline">
                        Sign in
                        </a>
                </p>
            </div>
        </div>
    )
}