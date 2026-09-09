'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

type Props = {
    connectionId: string
    platform: 'INSTAGRAM' | 'FACEBOOK'
    pages: Array<{ id: string; name: string }>
}

export function PagePicker({ connectionId, platform, pages }: Props) {
    const router = useRouter()
    const [selectedPageId, setSelectedPageId] = useState(pages[0]?.id ?? '')
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const { t, i18n } = useTranslation('dashboard')

    const connect = async () => {
        setError('')
        setIsSaving(true)
        const response = await fetch('/api/channels/connect/select', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connectionId, pageId: selectedPageId })
        })
        setIsSaving(false)
        if (!response.ok) {
            setError('This connection has expired. Please start again from the channels page.')
            return
        }
        router.push('/dashboard/channels?connected=true')
        router.refresh()
    }

    return (
        <div className={`mx-auto max-w-2xl space-y-6 p-6 ${i18n.language === 'ar' ? 'font-arabic' : 'font-display'}`}>

            <div className='flex flex-col items-center'>
                <h1 className="text-3xl font-semibold text-foreground">
                    {t('channels.select.title')}
                </h1>
                <h3 className="mt-2 text-md text-muted-foreground">
                    {t('channels.select.subtitle')}
                </h3>
            </div>

            <Card className="space-y-2 border border-border rounded-lg p-4 bg-card/50 max-h-64 overflow-y-auto">
                    {pages.map((page) => (
                        <label key={page.id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-background border border-border/50 hover:border-border transition-colors p-4">
                            <input type="radio" name="page" value={page.id} checked={selectedPageId === page.id} onChange={() => setSelectedPageId(page.id)} />
                            <span className="font-medium text-xl text-foreground">{page.name}</span>
                        </label>
                    ))}
                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
                <div className="mt-6 flex gap-3">

                    <Button className='bg-white hover:bg-white/85 text-black/70 text-[0.95rem] w-37 hover:cursor-pointer hover:scale-[1.001] focus:scale[0.99]' onClick={connect} disabled={!selectedPageId || isSaving}>
                    {isSaving ? t('channels.select.connecting') : t('channels.select.connect')}
                    </Button>

                    <Button className='text-[0.95rem] hover:cursor-pointer hover:scale-[1.001] focus:scale[0.99]' variant="outline" onClick={() => router.push('/dashboard/channels')}>
                        {t('channels.cancel')}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
