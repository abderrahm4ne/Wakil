"use client"
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Props {
    isDay: boolean
    username: string | null | undefined
    planDisplayed: string
    botOn: boolean
}

export default function WelcomingOverView({isDay, username, planDisplayed, botOn}: Props){
    const { t } = useTranslation('dashboard')
    return(
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35}}
            className='flex flex-col space-y-3 relative '
        >
            <h1 className='sm:text-4xl text-[1.6rem] text-foreground tracking-tight font-semibold'>
                {isDay ? t('overview.goodmorning') : t('overview.goodafternoon')}, {username ?? 'USER'}
            </h1>
            <div className=' flex-row items-center space-x-5 font-medium hidden sm:flex'>
                <span className='text-muted-foreground text-xl '>{planDisplayed} {t('overview.plan')}

                </span>
                <div className='w-0.5 h-6 bg-muted-foreground' />
                <span className='flex items-center gap-2 text-xl '>
                                <span className={`relative flex h-2 w-2`}>
                                    {botOn && (
                                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75' />
                                        )}
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${botOn ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                                </span>
                                <span className={botOn ? 'text-foreground' : 'text-muted-foreground'}>
                                    {t('Bot')} {botOn ? t('overview.active') : t('overview.paused')}
                                </span>
                </span>
             </div>
        </motion.div>
    )
}