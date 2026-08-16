"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Trash2, Loader2, Save, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface MenuNode {
    id: string
    label: string
    language: "ARABIC" | "FRENCH" | "DARIJA"
    responseText: string | null
    nodeType: "MENU" | "CONFIRM" | "CALL_OWNER" | "FALLBACK"
    order: number
    parentId: string | null
}

const MAX_TOTAL_NODES = 50
const MAX_CHILDREN_PER_PARENT = 13 // Meta's hard limit on quick_replies

export function MenuNodeManager() {
    const [nodes, setNodes] = useState<MenuNode[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null) // id being saved, for per-row spinner
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const fetchNodes = async () => {
        try {
            const res = await fetch("/api/menu-nodes")
            const data = await res.json()
            if (data.success) setNodes(data.data)
        } catch (err) {
            console.error("Failed to fetch menu nodes", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNodes()
    }, [])

    const childCountByParent = useMemo(() => {
        const map: Record<string, number> = {}
        for (const n of nodes) {
            const key = n.parentId ?? "__root__"
            map[key] = (map[key] ?? 0) + 1
        }
        return map
    }, [nodes])

    const canAddChildTo = (parentId: string | null) => {
        const key = parentId ?? "__root__"
        return (childCountByParent[key] ?? 0) < MAX_CHILDREN_PER_PARENT
    }

    const addNode = (parentId: string | null) => {
        setError(null)
        if (nodes.length >= MAX_TOTAL_NODES) {
            setError(`You've reached the maximum of ${MAX_TOTAL_NODES} nodes.`)
            return
        }
        if (!canAddChildTo(parentId)) {
            setError(`A menu can only offer up to ${MAX_CHILDREN_PER_PARENT} options (Messenger's limit).`)
            return
        }
        const tempId = `temp-${crypto.randomUUID()}`
        setNodes(prev => [...prev, {
            id: tempId,
            label: "",
            language: "ARABIC",
            responseText: "",
            nodeType: "MENU",
            order: childCountByParent[parentId ?? "__root__"] ?? 0,
            parentId
        }])
    }

    const removeNode = async (id: string) => {
        // removing a node removes its whole subtree (cascade) — warn if it has children
        const hasChildren = nodes.some(n => n.parentId === id)
        if (hasChildren && !confirm("This will also delete all sub-options under it. Continue?")) return

        if (!id.startsWith("temp-")) {
            try {
                await fetch(`/api/menu-nodes/${id}`, { method: "DELETE" })
            } catch (err) {
                console.error("Failed to delete node", err)
                setError("Failed to delete node.")
                return
            }
        }

        // drop the node and any descendants from local state
        const toRemove = new Set([id])
        let changed = true
        while (changed) {
            changed = false
            for (const n of nodes) {
                if (n.parentId && toRemove.has(n.parentId) && !toRemove.has(n.id)) {
                    toRemove.add(n.id)
                    changed = true
                }
            }
        }
        setNodes(prev => prev.filter(n => !toRemove.has(n.id)))
    }

    const updateNode = (id: string, field: keyof MenuNode, value: string) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n))
    }

    const saveNode = async (node: MenuNode) => {
        setError(null)
        if (!node.label || !node.language || !node.nodeType) {
            setError("Every node needs a label, language, and type.")
            return
        }

        setSaving(node.id)
        try {
            const isNew = node.id.startsWith("temp-")
            const res = await fetch(
                isNew ? "/api/menu-nodes" : `/api/menu-nodes/${node.id}`,
                {
                    method: isNew ? "POST" : "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        label: node.label,
                        language: node.language,
                        responseText: node.responseText,
                        nodeType: node.nodeType,
                        order: node.order,
                        parentId: node.parentId
                    })
                }
            )
            const data = await res.json()
            if (!data.success) throw new Error(data.error)

            setNodes(prev => prev.map(n => n.id === node.id ? data.data : n))
            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)
        } catch (err: any) {
            setError(err.message ?? "Failed to save node.")
        } finally {
            setSaving(null)
        }
    }

    const rootNodes = nodes.filter(n => n.parentId === null)

    const renderNode = (node: MenuNode, depth: number): React.ReactNode => {
        const children = nodes.filter(n => n.parentId === node.id)
        const isNew = node.id.startsWith("temp-")
        const isLeafType = node.nodeType !== "MENU"

        return (
            <div key={node.id} style={{ marginInlineStart: depth * 24 }} className="space-y-3">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-2 mb-3 text-slate-500 text-xs">
                            {depth > 0 && <ChevronRight className="h-3 w-3 mt-0.5" />}
                            <span>{depth === 0 ? "Root option" : `Sub-option (level ${depth + 1})`}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            <div className="md:col-span-3 space-y-2">
                                <Label className="text-slate-300">Button label</Label>
                                <Input
                                    value={node.label}
                                    onChange={(e) => updateNode(node.id, "label", e.target.value.slice(0, 20))}
                                    placeholder="e.g. Pricing"
                                    maxLength={20}
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                                <p className="text-xs text-slate-600">{node.label.length}/20 (Messenger limit)</p>
                            </div>

                            <div className="md:col-span-4 space-y-2">
                                <Label className="text-slate-300">Bot says when reached</Label>
                                <Input
                                    value={node.responseText ?? ""}
                                    onChange={(e) => updateNode(node.id, "responseText", e.target.value)}
                                    placeholder="e.g. Our prices start from 2000 DZD"
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-slate-300">Language</Label>
                                <select
                                    value={node.language}
                                    onChange={(e) => updateNode(node.id, "language", e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-md p-2 h-10 text-sm"
                                >
                                    <option value="ARABIC">Arabic</option>
                                    <option value="FRENCH">French</option>
                                    <option value="DARIJA">Darija</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-slate-300">Type</Label>
                                <select
                                    value={node.nodeType}
                                    onChange={(e) => updateNode(node.id, "nodeType", e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-md p-2 h-10 text-sm"
                                >
                                    <option value="MENU">Menu (has sub-options)</option>
                                    <option value="CONFIRM">Confirm order</option>
                                    <option value="CALL_OWNER">Call owner</option>
                                    <option value="FALLBACK">Fallback to free text</option>
                                </select>
                            </div>

                            <div className="md:col-span-1 flex items-end justify-end h-full gap-2 pb-1">
                                <Button
                                    size="icon"
                                    onClick={() => saveNode(node)}
                                    disabled={saving === node.id}
                                    className="bg-secondary text-slate-950 hover:bg-secondary/90"
                                    title="Save this node"
                                >
                                    {saving === node.id
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <Save className="h-4 w-4" />
                                    }
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeNode(node.id)}
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
                                    title="Delete this node and its sub-options"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {isNew && (
                            <p className="text-xs text-amber-500 mt-3">Unsaved — click save to create.</p>
                        )}

                        {node.nodeType === "MENU" && !isNew && (
                            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                    {children.length}/{MAX_CHILDREN_PER_PARENT} sub-options
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addNode(node.id)}
                                    disabled={!canAddChildTo(node.id)}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                >
                                    <Plus className="mr-1 h-3 w-3" /> Add sub-option
                                </Button>
                            </div>
                        )}

                        {isLeafType && children.length > 0 && (
                            <p className="text-xs text-amber-500 mt-3">
                                This node has sub-options but its type isn't "Menu" — sub-options won't be reachable until you switch the type back or remove them.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {children.map(child => renderNode(child, depth + 1))}
            </div>
        )
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
                    <h2 className="text-2xl font-bold text-white">Bot Menu Tree</h2>
                    <p className="text-slate-400">
                        Build tappable menus for customers ({nodes.length}/{MAX_TOTAL_NODES} nodes)
                    </p>
                </div>
                <Button
                    onClick={() => addNode(null)}
                    disabled={nodes.length >= MAX_TOTAL_NODES || !canAddChildTo(null)}
                    className="bg-secondary text-slate-950 hover:bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Root Option
                </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-secondary text-sm">Saved.</p>}

            <div className="space-y-4">
                {rootNodes.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
                        <p className="text-slate-500">No menu options yet. Click "Add Root Option" to get started.</p>
                    </div>
                ) : (
                    rootNodes
                        .sort((a, b) => a.order - b.order)
                        .map(node => renderNode(node, 0))
                )}
            </div>
        </div>
    )
}