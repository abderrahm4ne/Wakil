import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PagePicker } from '@/components/channels/PagePicker'

type Props = { searchParams: Promise<{ connection?: string }> }

export default async function SelectChannelPage({ searchParams }: Props) {
    const session = await auth()
    if (!session) redirect('/login')

    const { connection: connectionId } = await searchParams
    if (!connectionId) redirect('/dashboard/channels?error=INVALID_CONNECTION')

    const connection = await prisma.pendingChannelConnection.findUnique({ where: { id: connectionId } })
    if (!connection || connection.userId !== session.user.id || connection.expiresAt < new Date()) {
        redirect('/dashboard/channels?error=CONNECTION_EXPIRED')
    }

    const pages = (connection.pages as Array<{ id: string; name: string }>).map(({ id, name }) => ({ id, name }))
    return <PagePicker connectionId={connection.id} platform={connection.platform} pages={pages} />
}
