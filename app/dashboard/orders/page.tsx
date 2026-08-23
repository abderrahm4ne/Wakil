"use client"

import { Card } from '@/components/ui/card'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type OrderItem = { sku: string; name: string; variant?: string; qty: number; price: number }
type Order = {
    id: string
    status: 'PENDING_REVIEW' | 'CONFIRMED' | 'CANCELLED'
    items: OrderItem[]
    totalPrice: number
    customerName: string | null
    customerPhone: string | null
    address: string | null
    createdAt: string
    orderNumber: number
}

const STATUS_TABS = ['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'CANCELLED'] as const

const statusStyle: Record<Order['status'], string> = {
    PENDING_REVIEW: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    CONFIRMED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
}
export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<typeof STATUS_TABS[number]>('ALL')
    const [confirmingId, setConfirmingId] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/orders')
            .then((res) => res.json())
            .then((res) => { if (res.success) setOrders(res.data) })
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        if (activeTab === 'ALL') return orders
        return orders.filter((o) => o.status === activeTab)
    }, [orders, activeTab])

    const confirmOrder = async (id: string) => {
        setConfirmingId(id)
        const res = await fetch(`/api/orders/${id}/confirm`, { method: 'PATCH' })
        const data = await res.json()
        if (data.success) {
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status: 'CONFIRMED' } : o))
            )
        }
        setConfirmingId(null)
    }

    const counts = useMemo(() => {
        const c: Record<string, number> = { ALL: orders.length }
        for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1
        return c
    }, [orders])

    return (
        <div className="flex flex-col h-[calc(100vh-3rem)] p-6 font-display gap-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Orders</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Review and confirm orders captured by your bot
                </p>
            </div>

            <div className="flex gap-2 border-b border-border">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab.replace('_', ' ')} {counts[tab] ? `(${counts[tab]})` : ''}
                    </button>
                ))}
            </div>

            <Card className="flex-1 overflow-auto p-0">
                {loading ? (
                    <p className="p-4 text-sm text-muted-foreground italic">Loading...</p>
                ) : orders.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground italic">No orders found</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="border-b border-border text-muted-foreground text-left">
                            <tr>
                                <th className="p-3 font-medium">Order Num</th>
                                <th className="p-3 font-medium">Customer</th>
                                <th className="p-3 font-medium">Items</th>
                                <th className="p-3 font-medium">Total</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Date</th>
                                <th className="p-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o) => (
                                <tr key={o.id} className="border-b border-border last:border-0">
                                    <td className="p-3">
                                        <div className="font-medium text-foreground">{o.orderNumber }</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="font-medium text-foreground">{o.customerName ?? '—'}</div>
                                        <div className="text-xs text-muted-foreground">{o.customerPhone ?? ''}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col gap-1">
                                            {o.items.map((it, i) => (
                                                <Link
                                                    key={i}
                                                    href={`/dashboard/products?sku=${encodeURIComponent(it.sku)}`}
                                                    className="text-primary hover:underline text-xs"
                                                >
                                                    {it.qty}× {it.name}{it.variant ? ` (${it.variant})` : ''}
                                                </Link>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-3 text-foreground">{o.totalPrice} DZD</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs border ${statusStyle[o.status]}`}>
                                            {o.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-3 text-muted-foreground text-xs">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        {o.status === 'PENDING_REVIEW' && (
                                            <button
                                                onClick={() => confirmOrder(o.id)}
                                                disabled={confirmingId === o.id}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50"
                                            >
                                                {confirmingId === o.id ? '...' : 'Confirm'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    )
}