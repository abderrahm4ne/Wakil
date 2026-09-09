import { ConnectSuccessSheet } from '@/components/channels/connect-success-sheet'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Page {
  id: string
  name: string
  hasInstagram?: boolean
}

export default async function ChannelSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ connection?: string; platform?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { connection, platform } = await searchParams

  if (!connection || !platform || (platform !== 'INSTAGRAM' && platform !== 'FACEBOOK')) {
    redirect('/dashboard/channels')
  }

  // Fetch pending connection
  const pendingConnection = await prisma.pendingChannelConnection.findUnique({
    where: { id: connection }
  })

  if (
    !pendingConnection ||
    pendingConnection.userId !== session.user.id ||
    new Date() > pendingConnection.expiresAt
  ) {
    redirect('/dashboard/channels?error=CONNECTION_EXPIRED')
  }


  return (
    <ConnectSuccessSheet
      platform={platform as 'INSTAGRAM' | 'FACEBOOK'}
      pages={pendingConnection.pages as unknown as Page[]}
      connectionId={connection}
    />
  )
}