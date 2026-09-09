import { ConnectPermissions } from '@/components/channels/connect-permissions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ChannelPermissionsPage({
  searchParams
}: {
  searchParams: Promise<{ platform?: string; botId?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { platform, botId } = await searchParams

  if (!platform || !botId || (platform !== 'INSTAGRAM' && platform !== 'FACEBOOK')) {
    redirect('/dashboard/channels')
  }

  return (
    <ConnectPermissions 
      platform={platform as 'INSTAGRAM' | 'FACEBOOK'} 
      botId={botId} 
    />
  )
}