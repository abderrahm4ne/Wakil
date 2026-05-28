"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface Rule {
    id?: string
    trigger: string
    response: string
    language: "ARABIC" | "FRENCH" | "DARIJA"
    order: number
}

export function RuleManager() {
    const [rules, setRules] = useState<Rule[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const fetchRules = async () => {
        try {
            const res = await fetch("/api/bot/rule")
            const data = await res.json()
            if (data.success) setRules(data.data)
        } catch (err) {
            console.error("Failed to fetch rules", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRules()
    }, [])

    const addRule = () => {
        if (rules.length >= 20) return
        setRules(prev => [...prev, {
            trigger: "",
            response: "",
            language: "ARABIC",
            order: prev.length
        }])
    }

    const removeRule = async (index: number, id?: string) => {
        if (id) {
            await fetch(`/api/bot/rule/${id}`, { method: "DELETE" })
        }
        setRules(prev => prev.filter((_, i) => i !== index))
    }

    const updateRule = (index: number, field: keyof Rule, value: string) => {
        setRules(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const saveRules = async () => {
        setError(null)
        setSuccess(false)

        if (rules.some(r => !r.trigger || !r.response)) {
            setError("All rules must have a trigger and a response.")
            return
        }

        setSaving(true)
        try {
            const res = await fetch("/api/bot/rule/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rules })
            })

            const data = await res.json()
            if (!data.success) throw new Error(data.error)

            setRules(data.data)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Bot Rules</h2>
                    <p className="text-slate-400">
                        Define how your bot responds to specific keywords ({rules.length}/20)
                    </p>
                </div>
                <Button
                    onClick={addRule}
                    disabled={rules.length >= 20}
                    className="bg-secondary text-slate-950 hover:bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Rule
                </Button>
            </div>

            <div className="grid gap-4">
                {rules.map((rule, index) => (
                    <Card key={index} className="bg-slate-900/50 border-slate-800">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                <div className="md:col-span-4 space-y-2">
                                    <Label className="text-slate-300">If customer says</Label>
                                    <Input
                                        value={rule.trigger}
                                        onChange={(e) => updateRule(index, "trigger", e.target.value)}
                                        placeholder="e.g. price, how much"
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </div>
                                <div className="md:col-span-5 space-y-2">
                                    <Label className="text-slate-300">Bot responds with</Label>
                                    <Input
                                        value={rule.response}
                                        onChange={(e) => updateRule(index, "response", e.target.value)}
                                        placeholder="e.g. Our prices start from 2000 DZD"
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-slate-300">Language</Label>
                                    <select
                                        value={rule.language}
                                        onChange={(e) => updateRule(index, "language", e.target.value as any)}
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-md p-2 h-10 text-sm"
                                    >
                                        <option value="ARABIC">Arabic</option>
                                        <option value="FRENCH">French</option>
                                        <option value="DARIJA">Darija</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1 flex items-end justify-end h-full pb-1">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeRule(index, rule.id)}
                                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {rules.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
                        <p className="text-slate-500">No rules yet. Click "Add Rule" to get started.</p>
                    </div>
                )}
            </div>

            {rules.length > 0 && (
                <div className="flex items-center justify-end gap-4 pt-4">
                    {success && (
                        <p className="text-secondary text-sm">Rules saved successfully.</p>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <Button
                        onClick={saveRules}
                        disabled={saving}
                        className="bg-secondary text-slate-950 hover:bg-secondary/90"
                    >
                        {saving
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Save className="mr-2 h-4 w-4" />
                        }
                        Save All Rules
                    </Button>
                </div>
            )}
        </div>
    )
}