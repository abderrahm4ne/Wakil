export type OrderItem = {
    sku: string
    name: string
    variant?: string
    qty: number
    price: number
}

export type Order = {
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

export const STATUS_TABS = ['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'CANCELLED'] as const
export type StatusTab = typeof STATUS_TABS[number]

export const statusStyle: Record<Order['status'], string> = {
    PENDING_REVIEW: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    CONFIRMED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
}