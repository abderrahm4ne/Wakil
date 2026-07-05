import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Plan } from '@/generated/prisma/enums'

const PLAN_ORDER: Record<Plan, number> = {
  FREE_TRIAL: 0,
  STARTER: 1,
  PRO: 2,
  BUSINESS: 3
}

export async function POST(req: NextRequest) {
    try{
        const session = await auth();
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const { plan } = await req.json();
        if (!plan || !Object.keys(PLAN_ORDER).includes(plan)) {
            return NextResponse.json(
                { success: false, error: 'INVALID_PLAN' }, { status: 400 }
            )
        }

        const current = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        })

        if (current && PLAN_ORDER[plan as Plan] <= PLAN_ORDER[current.plan as Plan]) {
            return NextResponse.json(
                { success: false, error: 'CANNOT_DOWNGRADE_HERE' }, { status: 400 }
            )
        }
        const start = new Date();
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1)
        const subscription = await prisma.subscription.update({
            where: { userId: session.user.id },
            data: {
                plan: plan as Plan,
                isActive: false,
                startDate: start,
                endDate: end,
            }
        })

        return NextResponse.json({ success: true, data: subscription })
    }
    catch (err) {
        console.error('error in upgrade subscription', err);
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}