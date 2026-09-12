"use client"
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
    bot: { isActive: boolean; storeName: string; storeCity: string; storeContact: string } | null | undefined
}

export function StoreInfoCard({ bot }: Props) {
    const { t } = useTranslation('dashboard')

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className='flex flex-col bg-linear-to-b from-black via-90% to-black/70 border border-border rounded-xl px-5 py-4 w-[75%] self-center mt-15'
        >
            <div className='flex md:flex-row flex-col gap-y-2 items-center justify-between mb-4 py-2 font-semibold'>
                <h2>{t('overview.storeInformations')}</h2>
                <a href='/dashboard/bot/settings' className='flex items-center gap-1 text-xs text-secondary hover:underline'>
                    {t('overview.botConfiguration')} <ArrowUpRight size={15} />
                </a>
            </div>

            {(!bot || bot.isActive === false) ? (
                <p className='text-muted-foreground text-sm py-6 text-center font-normal'>
                    {t('overview.botIs')}<span className='text-red-600 px-2'>OFF</span>
                </p>
            ) : (
                <div className='flex flex-col divide-y divide-border text-md'>
                    <h2 className='py-2 px-2 font-medium flex sm:flex-row sm:gap-x-4 flex-col'>{t('overview.storeName')} : <span className='font-normal'>{bot.storeName}</span></h2>
                    <h2 className='py-2 px-2 font-medium flex sm:flex-row sm:gap-x-4 flex-col'>{t('overview.storeLocation')} : <span className='font-normal'>{bot.storeCity}</span></h2>
                    <h2 className='py-2 px-2 font-medium flex sm:flex-row sm:gap-x-4 flex-col'>{t('overview.storeContact')} : <span className='font-normal'>{bot.storeContact}</span></h2>
                </div>
            )}
        </motion.div>
    )
}