"use client"
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Order = {
    orderNumber: number
    customerName: string
    status: string
}

type Channel = {
    id: string
    type: string
    isActive: boolean
}

interface Props {
    orders: Order[] | null | undefined
    channelsCount: number
    channels: Channel[] | undefined
}

export function OrdersChannelsGrid({ orders, channelsCount, channels}: Props) {
    const { t } = useTranslation('dashboard')
    return (
        <section className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-15'>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className='flex flex-col bg-linear-to-br from-secondary/10 to-green-600/5 border border-border rounded-xl px-5 py-4 w-full'
            >
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-normal'>{t('overview.recentOrders')}</h2>
                    <a href='/dashboard/orders' className='flex items-center gap-1 text-md text-secondary font-normal tracking-wider hover:underline'>
                        {t('overview.viewAll')} <ArrowUpRight size={12} />
                    </a>
                </div>

                {(!orders || orders.length === 0) ? (
                    <p className='text-muted-foreground text-sm py-6 text-center font-semibold'>{t('overview.noRecentOrdersYet')}</p>
                ) : (
                    <div className='flex flex-col divide-y divide-border'>
                        {orders.map(order => (
                            <div key={order.orderNumber} className='flex items-center gap-3 py-2.5'>
                                <span className='text-xs font-mono text-muted-foreground w-8'>#{order.orderNumber}</span>
                                <span className='font-medium text-sm truncate flex-1'>{order.customerName}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                    ${order.status === 'PENDING_REVIEW'
                                        ? 'bg-orange-400/15 text-orange-500'
                                        : 'bg-green-500/15 text-green-600'}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className='flex flex-col bg-card border border-border rounded-xl px-5 py-4 w-full'
            >
                <h2 className='font-normal text-lg mb-4'>{t('overview.Channels')}</h2>

                {channelsCount === 0 ? (
                    <div className='flex flex-col items-center justify-center py-6 gap-2 text-center'>
                        <p className='text-sm text-muted-foreground font-semibold'>{t('overview.noChannelConnectedYet')}</p>
                        <a href='/dashboard/channels' className='text-xs text-secondary tracking-wide hover:underline font-normal'>{t('overview.connecteInstagramOrFacebook')}</a>
                    </div>
                ) : (
                    <div className='flex flex-col divide-y divide-border'>
                        {channels?.map(channel => (
                            <div key={channel.id} className='flex items-center gap-3 py-2.5'>
                                <span className={`w-2 h-2 rounded-full ${channel.isActive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                                <span className='text-sm font-medium flex-1'>
                                    {channel.type.charAt(0) + channel.type.slice(1).toLowerCase()}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                    ${channel.isActive ? 'bg-green-500/15 text-green-600' : 'bg-muted-foreground/15 text-muted-foreground'}`}>
                                    {channel.isActive ? t('overview.connected') : t('overview.inActive')}
                                </span>
                            </div>
                        ))}
                        {channelsCount < 2 && (
                            <a href='/settings/channels' className='flex items-center gap-1 text-xs text-secondary hover:underline pt-3 font-normal'>
                                <span>{t('overview.connectAnotherChannel')}</span>
                            </a>
                        )}
                    </div>
                )}
            </motion.div>

        </section>
    )
}