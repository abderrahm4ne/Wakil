"use client"

import { LoginForm } from "@/components/auth/LoginForm"
import WakilLogo from "@/components/common/WakilLogo"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Login(){
    const { t } = useTranslation(['auth', 'landing'])

    return(
    <div className="relative flex items-center justify-center h-screen bg-black/90" >
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

        <div className="flex lg:h-3/4 w-3/4 rounded-2xl overflow-hidden z-10" style={{
        boxShadow: "-5px 4px 10px rgba(255, 255, 255, 0.1)"
    }}>
           
            {/* left side gradient */}
            <div className="hidden lg:flex lg:w-2/4 h-full relative overflow-hidden font-display">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A9E6E_50%,#0D6E7A)]"/>

                <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-cyan-400/15 blur-2xl" />


                <div className="relative z-10 flex flex-col justify-between p-12">
                    
                    <WakilLogo />
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white text-balance ">
                        {t('hero.tagline', { ns: 'landing' })}
                        </h1>
                        <p className="text-lg text-white/70 max-w-md">
                        {t('hero.description', { ns: 'landing' })}
                        </p>
                    </div>
                    
                    <p className="text-sm text-white/90">
                        © 2026 Wakil. {t('footer.rights', { ns: 'landing' })}.
                    </p>
                    </div>
            </div>

            {/* right side form */}
            <div className="bg-black flex flex-col justify-center items-center md:space-y-10 space-y-8 lg:w-3/4 w-full h-full py-12 overflow-hidden font-display">

                {/* Welcoming */}
                <div className="flex flex-col items-start lg:w-[45%] w-[80%] space-y-2">
                    <h1 className="font-bold md:text-3xl text-xl font-sans tracking-tight text-nowrap">{t('login.title')}</h1>
                    <h3 className="font-semibold md:text-md text-xs text-muted-foreground tracking-tight text-nowrap">{t('login.subtitle')}</h3>
                </div>
                
                {/* login form */}
                <LoginForm />
            </div>

        </div>
    </div>
    )
}
