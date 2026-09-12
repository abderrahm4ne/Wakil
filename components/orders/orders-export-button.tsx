'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { Order } from '@/types/orders'
import { motion } from 'framer-motion'

interface Props {
    orders: Order[]
}

export function OrdersExportButton({ orders }: Props) {
    const [exporting, setExporting] = useState(false)
    const { t } = useTranslation('dashboard')

    const handleExport = () => {
        if (!orders.length) {
            toast.error(t('orders.exportEmpty', { defaultValue: 'No orders to export' }))
            return
        }

        setExporting(true)
        try {
            const rows = orders.map((o) => ({
                order_number: o.orderNumber,
                customer: o.customerName ?? '',
                phone: o.customerPhone ?? '',
                address: o.address ?? '',
                items: o.items.map(i => `${i.qty}x ${i.name}${i.variant ? ` (${i.variant})` : ''}`).join(', '),
                total_dzd: Number(o.totalPrice),
                status: o.status,
                date: new Date(o.createdAt).toLocaleDateString(),
            }))

            const ws = XLSX.utils.json_to_sheet(rows)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'Orders')
            XLSX.writeFile(wb, `wakil_orders_${new Date().toISOString().slice(0, 10)}.xlsx`)

            toast.success(t('orders.exportSuccess', { defaultValue: 'Orders exported' }))
        } catch {
            toast.error(t('orders.exportError', { defaultValue: 'Export failed' }))
        } finally {
            setExporting(false)
        }
    }

    return (
        <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
        >
            <button
                type="button"
                onClick={handleExport}
                disabled={exporting || !orders.length}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 disabled:opacity-40 transition hover:cursor-pointer w-fit"
            >
                {exporting
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Download className="h-4 w-4" />
                }
                {t('orders.status.export', { defaultValue: 'Export' })}
            </button>
        </motion.div>
    )
}