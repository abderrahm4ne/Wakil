'use client'

import Link from 'next/link'
import { Loader2, PackageOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Order, statusStyle } from '@/types/orders'

interface Props {
    orders: Order[]
    loading: boolean
    confirmingId: string | null
    onConfirm: (id: string) => void
}

export function OrdersTable({ orders, loading, confirmingId, onConfirm }: Props) {
    const { t } = useTranslation('dashboard')

    if (loading) {
        return (
            <div className="flex flex-col gap-3 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse h-14 rounded-xl bg-muted/30" />
                ))}
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <PackageOpen className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                    {t('orders.empty', { defaultValue: 'No orders found' })}
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-auto">
            <table className="w-full text-sm">
                <thead className="border-b border-border/60 text-muted-foreground text-left">
                    <tr>
                        <th className="px-4 py-3 font-medium">{t('orders.table.number', { defaultValue: '#' })}</th>
                        <th className="px-4 py-3 font-medium">{t('orders.table.customer', { defaultValue: 'Customer' })}</th>
                        <th className="px-4 py-3 font-medium">{t('orders.table.items', { defaultValue: 'Items' })}</th>
                        <th className="px-4 py-3 font-medium">{t('orders.table.total', { defaultValue: 'Total' })}</th>
                        <th className="px-4 py-3 font-medium">{t('orders.table.status', { defaultValue: 'Status' })}</th>
                        <th className="px-4 py-3 font-medium">{t('orders.table.date', { defaultValue: 'Date' })}</th>
                        <th className="px-4 py-3 font-medium" />
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o, i) => (
                        <motion.tr
                            key={o.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                        >
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-muted-foreground">
                                    #{o.orderNumber}
                                </span>
                            </td>

                            <td className="px-4 py-3">
                                <p className="font-medium text-foreground text-sm">{o.customerName ?? '—'}</p>
                                {o.customerPhone && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{o.customerPhone}</p>
                                )}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-0.5">
                                    {o.items.map((it, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/dashboard/products?sku=${encodeURIComponent(it.sku)}`}
                                            className="text-xs text-secondary hover:underline"
                                        >
                                            {it.qty}× {it.name}{it.variant ? ` (${it.variant})` : ''}
                                        </Link>
                                    ))}
                                </div>
                            </td>

                            <td className="px-4 py-3">
                                <span className="font-medium text-foreground">{Number(o.totalPrice).toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground ms-1">{t('orders.table.dzd')}</span>
                            </td>

                            <td className="px-4 py-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle[o.status]}`}>
                                    {t(`orders.status.${o.status.toLowerCase()}`, { defaultValue: o.status.replace(/_/g, ' ') })}
                                </span>
                            </td>

                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                {new Date(o.createdAt).toLocaleDateString()}
                            </td>

                            <td className="px-4 py-3">
                                {o.status === 'PENDING_REVIEW' && (
                                    <button
                                        onClick={() => onConfirm(o.id)}
                                        disabled={confirmingId === o.id}
                                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 disabled:opacity-50 transition hover:cursor-pointer"
                                    >
                                        {confirmingId === o.id
                                            ? <Loader2 className="h-3 w-3 animate-spin" />
                                            : t('orders.confirm', { defaultValue: 'Confirm' })
                                        }
                                    </button>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}