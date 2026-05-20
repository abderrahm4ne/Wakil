import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth'
import { prisma } from "@/lib/prisma";

export async function GET(){
    try {
        const session = await auth();
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        })

        const now = new Date()
        const usageLog = await prisma.usageLog.findFirst({
            where: {
                bot: { userId: session.user.id },
                month: now.getMonth() + 1,
                year: now.getFullYear()
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                plan: subscription?.plan ?? 'FREE_TRIAL',
                isActive: subscription?.isActive ?? false,
                startDate: subscription?.startDate,
                endDate: subscription?.endDate,
                messageUsed: usageLog?.mssageCount ?? 0
            }
        })
    }
    catch (err) {
        console.error('error in get subscription', err);
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}