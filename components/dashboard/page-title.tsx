"use client"
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Props {
    title: string
    subTitle: string
}

export default function Welcoming({title, subTitle}: Props){
    const { t } = useTranslation('dashboard')
    return(
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35}}
            className='flex flex-col space-y-3 relative '
        >
            <h1 className="sm:text-4xl text-[1.6rem] text-foreground tracking-tight font-semibold">
                {t(title)}
            </h1>

            <p className="text-muted-foreground font-medium">
                {t(subTitle)}
            </p>
        </motion.div>
    )
}