'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Welcoming from '@/components/dashboard/page-title'
import { OrdersTabs } from '@/components/orders/orders-tabs'
import { OrdersTable } from '@/components/orders/orders-table'
import { Order, StatusTab } from '@/types/orders'

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<StatusTab>('ALL')
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

    const counts = useMemo(() => {
        const c: Record<string, number> = { ALL: orders.length }
        for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1
        return c
    }, [orders])

    const confirmOrder = async (id: string) => {
        setConfirmingId(id)
        const res = await fetch(`/api/orders/${id}`, { method: 'PATCH' })
        const data = await res.json()
        if (data.success) {
            setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'CONFIRMED' } : o))
        }
        setConfirmingId(null)
    }

    return (
        <div className="flex flex-col gap-6 font-display">

            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <Welcoming title="orders.title" subTitle="orders.subtitle" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl overflow-hidden"
            >
                <OrdersTabs activeTab={activeTab} counts={counts} onChange={setActiveTab} />
                <OrdersTable
                    orders={filtered}
                    loading={loading}
                    confirmingId={confirmingId}
                    onConfirm={confirmOrder}
                />
            </motion.div>

        </div>
    )
}