"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { User, Mail, Phone, ShieldCheck, Lock } from 'lucide-react'

export default function SettingsPage() {
    const { data: session, update } = useSession()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isGoogle, setIsGoogle] = useState(false)
    const [pendingEmail, setPendingEmail] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch('/api/user/settings')
                const res = await response.json()
                if (res.success) {
                    setName(res.data.name)
                    setEmail(res.data.email)
                    setPhoneNumber(res.data.phoneNumber ?? '')
                    setIsGoogle(res.data.hasPassword == false)
                    setPendingEmail(res.data.pendingEmail ?? null)
                    console.log(res.data.hasPassword)
                }
            } catch (err) {
                console.log('Error occured', err)
            }
        }
        load()
    }, [])

    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)
        const res = await fetch('/api/user/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email: isGoogle ? undefined : email, phoneNumber }),
        })
        const data = await res.json()
        if (data.success) {
            setMessage({ type: 'success', text: data.pendingEmailVerification ? 'Check your new email to confirm the change.' : 'Settings updated.' })
            if (data.pendingEmailVerification) setPendingEmail(email)
            await update()
        } else {
            setMessage({ type: 'error', text: data.error })
        }
        setSaving(false)
    }

    return (
        <div className="w-full flex justify-center px-4 py-10 font-display">
            <div className="w-full max-w-2xl space-y-6">

                {/* Header with avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/15 border border-secondary/25 flex items-center justify-center text-lg font-semibold text-secondary">
                        {initials || <User className="w-6 h-6" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Account settings</h1>
                        <p className="text-sm text-muted-foreground">Manage your personal information</p>
                    </div>
                </div>

                {/* Profile section */}
                <Card className="p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                        <User size={24} className="text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-foreground">Profile</h2>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-muted-foreground">Full name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-muted-foreground">Email address</label>
                            {isGoogle && (
                                <span className="flex items-center gap-1 text-xs text-secondary">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Google account
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <Mail size={24} className="absolute inset-a-3 -translate-y-1/2 top-1/2 text-muted-foreground pl-2" />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isGoogle}
                                className="w-full rounded-lg border border-border bg-background py-2 pl-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary transition"
                            />
                        </div>
                        {isGoogle ? (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                                <Lock className="w-3 h-3" /> Managed by Google — sign in there to change it.
                            </p>
                        ) : pendingEmail ? (
                            <p className="text-xs text-amber-500 pt-0.5">
                                Pending confirmation for {pendingEmail}. Check that inbox to finish the change.
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground pt-0.5">
                                Changing this sends a confirmation link to the new address.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-muted-foreground">Phone number</label>
                        <div className="relative">
                            <Phone size={24} className="absolute inset-a-3 -translate-y-1/2 top-1/2 text-muted-foreground pl-2" />
                            <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="0555 12 34 56"
                                className="w-full rounded-lg border border-border bg-background py-2 pl-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary transition"
                            />
                        </div>
                    </div>
                </Card>

                {/* Save bar */}
                <div className="flex items-center justify-between">
                    <div className="min-h-5">
                        {message && (
                            <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 transition"
                    >
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}