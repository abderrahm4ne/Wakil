import { Card } from '@/components/ui/card'
import { Check, X, Link2, Unlink } from 'lucide-react'
import Image from 'next/image'
import facebook from '@/assets/facebook.png'
import instagram from '@/assets/instagram.png'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getChannelsData } from '@/lib/actions/getChannelData'
import { ConnectButton } from '@/components/channels/ConnectButtom'
import { DisconnectButton } from '@/components/channels/DisconnectButton'

const PLATFORM_META = {
    INSTAGRAM: { label: 'Instagram', icon: instagram, color: 'text-pink-500' },
    FACEBOOK: { label: 'Facebook', icon: facebook, color: 'text-blue-500' },
} as const

export default async function ChannelsPage() {
    const session = await auth()
    if (!session) redirect('/login')

    const { channels, bot } = await getChannelsData(session.user.id)

    const byType = (type: 'INSTAGRAM' | 'FACEBOOK') =>
        channels.find((c) => c.type === type)

    return (
        <div className="space-y-8 p-6 font-display">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Channels</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Connect Instagram and Facebook pages to your bot.
                </p>
            </div>

            {!bot && (
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground italic">
                        Set up your bot before connecting a channel.
                    </p>
                </Card>
            )}

            {/* Platform cards */}
            {bot && (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {(['INSTAGRAM', 'FACEBOOK'] as const).map((type) => {
                        const meta = PLATFORM_META[type]
                        const channel = byType(type)
                        const connected = !!channel

                        return (
                            <Card key={type} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image src={meta.icon} alt={meta.label} className={`h-8 w-8 ${meta.color}`} />
                                        <div>
                                            <p className="font-semibold text-foreground">{meta.label}</p>
                                            <div className="mt-1 flex items-center gap-1.5">
                                                {connected ? (
                                                    <>
                                                        <Check className="h-4 w-4 text-emerald-400" />
                                                        <span className="text-sm text-emerald-400">Connected</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="h-4 w-4 text-red-500" />
                                                        <span className="text-sm text-red-500">Not connected</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                    {connected ? (
                                        <>
                                            <span className="text-sm text-muted-foreground truncate">
                                                Page ID: {channel!.pageId}
                                            </span>
                                            <DisconnectButton channelId={channel!.id} />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm text-muted-foreground">
                                                Not linked to any page
                                            </span>
                                            <ConnectButton platform={type} botId={bot.id} />
                                        </>
                                    )}
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Connected channels table */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground">Connected Channels</h2>
                <div className="mt-6">
                    {channels.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No channels connected yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left text-muted-foreground">
                                        <th className="pb-3 font-medium">Platform</th>
                                        <th className="pb-3 font-medium">Page ID</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Connected</th>
                                        <th className="pb-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {channels.map((channel) => {
                                        const meta = PLATFORM_META[channel.type as keyof typeof PLATFORM_META]
                                        return (
                                            <tr key={channel.id} className="border-b border-border last:border-0">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <meta.icon className={`h-4 w-4 ${meta.color}`} />
                                                        <span className="text-foreground">{meta.label}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted-foreground">{channel.pageId}</td>
                                                <td className="py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                                                            channel.isActive ? 'text-emerald-400' : 'text-red-500'
                                                        }`}
                                                    >
                                                        {channel.isActive ? (
                                                            <Link2 className="h-3 w-3" />
                                                        ) : (
                                                            <Unlink className="h-3 w-3" />
                                                        )}
                                                        {channel.isActive ? 'Active' : 'Expired'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-muted-foreground">
                                                    {new Date(channel.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <DisconnectButton channelId={channel.id} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}