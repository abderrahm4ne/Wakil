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
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    label: 'My Bot',
    href: '/dashboard/bot',
    icon: Bot,
  },
  {
    label: 'Channels',
    href: '/dashboard/channels',
    icon: Radio,
  },
  {
    label: 'Conversations',
    href: '/dashboard/conversations',
    icon: MessageSquare,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    label: 'Subscription',
    href: '/dashboard/subscription',
    icon: Settings,
  },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
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
                          <span>{item.label}</span>
                        </Link>
                    )
                })}
          </nav>
        </div>
    )
}
