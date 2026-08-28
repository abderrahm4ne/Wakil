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
import { useSidebarStore } from '@/stores/sidebar-store'

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
    const { isOpen, close } = useSidebarStore()

    return (
        <div
          className={cn(
            "fixed inset-s-0 top-0 z-40 h-screen w-64 border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-width duration-300 pt-4 flex flex-col space-y-10",
            isOpen
              ? "w-64 px-4"
              : "w-20 px-2"
          )}
          style={{boxShadow: '-2px 2px 10px black'}}
        >
            {/* Logo Section */}
            <div className="">
              <WakilLogo isOpen={isOpen}/>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 ">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setTimeout(() => close(), 500)
                          }}
                          className={cn(
                            'flex items-center rounded-lg py-3 text-sm font-sans transition-colors',
                            isActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                            isOpen 
                              ? 'gap-3 px-4'
                              : 'justify-center px-0'
                          )}
                        >
                          <Icon size={20} />
                          {isOpen && 
                          (
                            <span
                              className={cn(
                                "overflow-hidden whitespace-nowrap transition-all duration-200",
                                isOpen
                                  ? "w-auto opacity-100 translate-x-0"
                                  : "w-0 opacity-0 -translate-x-2"
                              )}
                            >
                              {t(`nav.${item.key}`)}
                            </span>
                          )}
                        </Link>
                    )
                })}
          </nav>
        </div>
    )
}
