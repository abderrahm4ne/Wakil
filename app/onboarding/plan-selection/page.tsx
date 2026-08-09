// app/onboarding/plan-selection/page.tsx
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OnBoardingPlanClient from "@/components/auth/OnBoardingPlanClient"

export default async function OnboardingPlanPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const existing = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    })
    if (existing) redirect("/dashboard")

    return <OnBoardingPlanClient />
}