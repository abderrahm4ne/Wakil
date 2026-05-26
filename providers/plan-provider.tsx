"use client"

import React, { createContext, useContext } from "react"

type PlanContextType = {
  plan: string
}

const PlanContext = createContext<PlanContextType | undefined>(undefined)

export function PlanProvider({ 
  children, 
  plan 
}: { 
  children: React.ReactNode
  plan: string 
}) {
  return (
    <PlanContext.Provider value={{ plan }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const context = useContext(PlanContext)
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider")
  }
  return context
}
