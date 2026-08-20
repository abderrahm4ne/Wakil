'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WakilLogo from '@/components/common/WakilLogo'
import {
  BarChart3,
  Bot,
  MessageSquare,
  Radio,
  Settings,
  Wallet,
  SendHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const navItems = [
  {
    key: 'overview',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    key: 'bot',
    href: '/dashboard/bot',
    icon: Bot,
  },
  {
    key: 'channels',
    href: '/dashboard/channels',
    icon: Radio,
  },
  {
    key: 'conversations',
    href: '/dashboard/conversations',
    icon: MessageSquare,
  },
  {
    key: 'analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    key: 'subscription',
    href: '/dashboard/subscription',
    icon: Settings,
  },
  {
    key: 'billing',
    href: '/dashboard/billing',
    icon: Wallet,
  },
  {
    key: 'orders',
    href: '/dashboard/orders',
    icon: SendHorizontal
  }
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { t } = useTranslation('dashboard')

    return (
        <div className="fixed start-0 top-0 z-40 h-screen w-64 border-e border-sidebar-border bg-sidebar text-sidebar-foreground">
            {/* Logo Section */}
            <div className="px-6 py-6">
              <WakilLogo />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6 ">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-sans transition-colors',
                            isActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{t(`nav.${item.key}`)}</span>
                        </Link>
                    )
                })}
          </nav>
        </div>
    )
}
