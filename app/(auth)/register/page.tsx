"use client"

import { RegisterForm } from "@/components/auth/RegisterForm"
import { PlanSelection } from "@/components/auth/PlanSelection"
import { ConfirmSubmit } from "@/components/auth/ConfirmSubmit"

import WakilLogo from "@/components/common/WakilLogo"

import { ChevronUp, ChevronDown } from "lucide-react"
import { RefObject, useRef, useState } from "react"

export default function Register() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [selectedPlan, setSelectedPlan] = useState("Starter")

    const containerRef = useRef<HTMLDivElement>(null)
    const formSectionRef = useRef<HTMLDivElement>(null)
    const planSectionRef = useRef<HTMLDivElement>(null)
    const confirmSubmitRef = useRef<HTMLDivElement>(null)

    const scrollToSection = (ref: RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const handleNext = () => {
        if (step === 1) scrollToSection(planSectionRef)
        if (step === 2) scrollToSection(confirmSubmitRef)
        setStep(s => s + 1)
    }

    const handleBack = () => {
        if (step === 2) scrollToSection(formSectionRef)
        if (step === 3) scrollToSection(planSectionRef)
        setStep(s => s - 1)
    }

    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div
                className="flex w-3/4 rounded-2xl overflow-hidden"
                style={{ boxShadow: "-5px 4px 10px rgba(255, 255, 255, 0.1)", height: "75vh" }}
            >
                {/* left side gradient */}
                <div className="hidden lg:flex lg:w-2/4 h-full relative overflow-hidden font-display">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A9E6E_50%,#0D6E7A)]" />
                    <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-cyan-400/15 blur-2xl" />
                    <div className="relative z-10 flex flex-col justify-between p-12">
                        <WakilLogo />
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-white text-balance">
                                Your AI-powered DM assistant
                            </h1>
                            <p className="text-lg text-white/70 max-w-md">
                                Automate your direct messages, engage with your audience, and grow your presence effortlessly.
                            </p>
                        </div>
                        <p className="text-sm text-white/90">© 2026 Wakil. All rights reserved.</p>
                    </div>
                </div>

                {/* right side */}
                <div
                    className="bg-black lg:w-3/4 w-full h-full relative font-display"
                >
                    <div
                        ref={containerRef}
                        className="overflow-y-scroll h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-y snap-mandatory px-3">

                            {[formSectionRef, planSectionRef, confirmSubmitRef].map((ref, i) => (
                                <div
                                    key={i}
                                    ref={ref}
                                    style={{ height: "100%", minHeight: "100%", scrollSnapAlign: "start", flexShrink: 0 }}
                                >
                                    {i === 0 && <RegisterForm data={formData} onChange={setFormData} />}
                                    {i === 1 && <PlanSelection selected={selectedPlan} onSelect={setSelectedPlan} />}
                                    {i === 2 && <ConfirmSubmit formData={formData} plan={selectedPlan} />}
                                </div>
                            ))}
                    </div>
                    

                    {/* Navigation buttons */}
                    <div className="absolute bottom-2 right-2 flex flex-col gap-2 z-10">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className="p-2 rounded-full border border-border hover:bg-card disabled:opacity-30 transition hover:cursor-pointer"
                        >
                            <ChevronUp className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={step === 3}
                            className="p-2 rounded-full border border-border hover:bg-card disabled:opacity-30 transition hover:cursor-pointer"
                        >
                            <ChevronDown className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}