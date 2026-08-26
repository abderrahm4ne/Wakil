import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
    isOpen: boolean
    toggle: () => void
    close: () => void
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            toggle: () => set((s) => ({ isOpen: !s.isOpen })),
            close: () => set({ isOpen: false})
        }),
        { name: 'wakil-sidebar' }
    )
)