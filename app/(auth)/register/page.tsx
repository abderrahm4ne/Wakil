"use client"

import { RegisterForm } from "@/components/auth/RegisterForm"
import { PlanSelection } from "@/components/auth/PlanSelection"
import { ConfirmSubmit } from "@/components/auth/ConfirmSubmit"

import WakilLogo from "@/components/common/WakilLogo"

import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react"
import { RefObject, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"

export default function Register() {
    const { t } = useTranslation(['auth', 'landing'])
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
<<<<<<< HEAD
        <div className="relative flex items-center justify-center h-screen bg-black/90">
            {/* Back to Home Button */}
            <Link 
                href="/" 
                className="absolute start-6 top-6 z-50 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
            >
                <div className="p-2 rounded-full border border-neutral-800 group-hover:border-neutral-700 bg-black/50 backdrop-blur-sm">
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                </div>
                <span className="text-sm font-medium" suppressHydrationWarning>{t('login.backToHome')}</span>
            </Link>

            <div className="absolute inset-0 opacity-30 overflow-hidden">
                <div className="absolute top-40 -left-40 w-80 h-80 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 -right-40 w-80 h-80 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
            </div>

=======
        <div className="relative flex items-center justify-center h-screen bg-background">
            <div className="absolute inset-0 opacity-20 overflow-x-hidden">
                <div className="absolute top-40 lg:-left-10 -left-75 w-80 h-80 bg-blue-600 rounded-full blur-3xl"></div>
                <div className="absolute top-40 -lg:right-10 -right-75 w-80 h-80 bg-blue-600 rounded-full blur-3xl"></div>
            </div>
>>>>>>> 725af48 ( style: working on home page sections)
            <div
                className="flex w-3/4 rounded-2xl overflow-hidden z-10"
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
                                {t('hero.tagline', { ns: 'landing' })}
                            </h1>
                            <p className="text-lg text-white/70 max-w-md">
                                {t('hero.description', { ns: 'landing' })}
                            </p>
                        </div>
                        <p className="text-sm text-white/90">© 2026 Wakil. {t('footer.rights', { ns: 'landing' })}.</p>
                    </div>
                </div>

                {/* right side */}
                <div
                    className="bg-black lg:w-3/4 w-full h-full relative font-display"
                >
                    <div
                        ref={containerRef}
                        className="overflow-y-hidden h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-y snap-mandatory px-3">

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
