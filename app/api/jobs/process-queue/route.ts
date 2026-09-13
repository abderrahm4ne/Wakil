import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { handleMetaMessage } from "@/lib/webhook/handler"
import { Client } from '@upstash/qstash'

const qstash = new Client({
    baseUrl: process.env.QSTASH_URL,
    token: process.env.QSTASH_TOKEN!,
})

export async function POST(req: NextRequest) {
    const queueRow = await prisma.messageQueue.findFirst({
        where: {
            status: 'PENDING',
            OR: [
                { nextRetryAt: null },
                { nextRetryAt: { lte: new Date() } }
            ]
        },
        orderBy: { createdAt: 'asc' }
    })

    if (!queueRow) {
        return NextResponse.json({ message: 'No pending messages' })
    }

    try {
        await handleMetaMessage(
            queueRow.pageId,
            queueRow.senderId,
            queueRow.text,
            queueRow.metaMessageId
        )

        await prisma.messageQueue.delete({
            where: { id: queueRow.id }
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        const delays = [10, 20, 40]
        const nextDelay = delays[queueRow.attempt - 1]

        if (queueRow.attempt < 3) {
            await prisma.messageQueue.update({
                where: { id: queueRow.id },
                data: {
                    attempt: { increment: 1 },
                    nextRetryAt: new Date(Date.now() + nextDelay * 1000),
                    error
                }
            })

            await qstash.publish({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/process-queue`,
                delay: nextDelay
            })
        } else {
            await prisma.messageQueue.update({
                where: { id: queueRow.id },
                data: { status: 'FAILED', error: error }
            })
        }

        return NextResponse.json({ error: error }, { status: 500 })
    }
}