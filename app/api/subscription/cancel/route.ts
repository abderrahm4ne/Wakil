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

        const subscription = await prisma.subscription.update({
            where: { userId: session.user.id },
            data: {
                isActive: false,
                endDate: new Date()
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