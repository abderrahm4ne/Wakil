import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OnBoardingPlanClient from "@/components/auth/OnBoardingPlanClient"
import getLang from "@/lib/locale"
import i18n from "@/lib/i18n-server"

export default async function OnboardingPlanPage() {
    const lang = await getLang()
    const t = i18n.getFixedT(lang, 'auth')
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const existing = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    })
    
    if (existing?.isActive) redirect("/dashboard")
    

    return <OnBoardingPlanClient />
}