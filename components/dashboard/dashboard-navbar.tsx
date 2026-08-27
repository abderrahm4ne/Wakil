'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'
import { logout } from '@/app/action/logout'
import { LogOut, Settings, User, PanelLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useSidebarStore } from '@/stores/sidebar-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function DashboardNavbar() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation('dashboard')

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedirectToSettingsPage = () => {
    redirect ('/dashboard/settings')
  }

  const user = session?.user

  const getGradient = (email: string) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-yellow-500',
      'from-green-500 to-emerald-500',
      'from-indigo-500 to-purple-500',
      'from-rose-500 to-orange-500',
    ]
    let hash = 0
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash)
    }
    return gradients[Math.abs(hash) % gradients.length]
  }
  const userGradient = user?.email ? getGradient(user.email) : 'from-gray-500 to-slate-500'
  const { isOpen, toggle } = useSidebarStore()

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur transition-[margin] duration-200",
      isOpen ? "ms-64" : "ms-20"
    )}>
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="p-2 hover:bg-accent rounded-lg">
          <PanelLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t('navbar.title')}</h1>
      </div>

      {/* Right side  */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className='hover:cursor-pointer hover:scale-[1.02] focus:scale-[0.99] ' asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <div className={`h-10 w-10 rounded-full bg-linear-to-br ${userGradient} flex items-center justify-center text-white font-medium border-2 border-background shadow-sm`}>
                {user?.name?.substring(0, 2).toUpperCase() || 'WK'}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-70">

            <DropdownMenuItem 
            className='hover:cursor-pointer flex items-center gap-2 px-2 py-3 ' 
            >
              <div className={`h-9 w-9 rounded-full bg-linear-to-br ${userGradient} flex items-center justify-center text-white font-medium shadow-sm`}>
                  {user?.name?.substring(0, 2).toUpperCase() || 'WK'}
              </div>
              <div className="flex flex-col gap-1 ">
                  <p className="text-sm font-medium leading-none text-wrap">{user?.name || t('navbar.userFallback')}</p>
                  <p className="text-xs leading-none text-muted-foreground text-wrap">
                    {user?.email || 'user@wakil.ai'}
                  </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
            className='hover:cursor-pointer' 
            >
              <Link href="/dashboard/settings" className='flex items-center space-x-3'>
                <Settings className="me-2 h-4 w-4" />
                <span>{t('navbar.settings')}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoading}
              className="text-destructive focus:text-destructive hover:cursor-pointer"
            >
              <LogOut className="me-2 h-4 w-4" />
              <span>{isLoading ? t('navbar.loggingOut') : t('navbar.logout')}</span>
            </DropdownMenuItem>


          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
