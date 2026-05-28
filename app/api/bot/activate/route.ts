import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const { isActive } = await req.json()
        
        const updateData: any = [
          prisma.bot.update({
            where: { userId: session.user.id },
            data: { isActive }
          })
        ]

        if (isActive === true) {
          updateData.push(
            prisma.subscription.update({
              where: { userId: session.user.id },
              data: { isActive: true }
            })
          )
        }

        const [bot] = await prisma.$transaction(updateData)

        return NextResponse.json({ success: true, data: bot })
        }
        catch (err){
            console.error("error in activate PATCH route" ,err)
            return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}