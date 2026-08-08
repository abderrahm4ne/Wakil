"use client"
import { signIn } from "next-auth/react"
import GoogleIcon from '@/assets/google.png'
import { useTranslation } from "react-i18next"

export default function GoogleButton() {
    const { t } = useTranslation('auth')

    return (
        <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-border hover:bg-card transition-colors hover:cursor-pointer"
        >
            <img src={GoogleIcon.src} className="w-5 h-5" />
            <span>{t('login.continueWithGoogle')}</span>
        </button>
    )
}