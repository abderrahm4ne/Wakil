"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { BotConfigForm } from "@/components/bot/bot-config-form"
import { ProductUpload } from "@/components/bot/product-upload"

export default function BotSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [bot, setBot] = useState<any>(null)
  const router = useRouter()

  const fetchBot = async () => {
    const res = await fetch("/api/bot")
    const data = await res.json()
    if (data.success) setBot(data.data)
    setLoading(false)
  }

  useEffect(() => { fetchBot() }, [])

  const handleSuccess = async () => {
    const wasNew = !bot
    await fetchBot()
    if (wasNew) router.push("/dashboard/bot")
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-12">
      <BotConfigForm initialData={bot} onSuccess={handleSuccess} />

      {bot?.type === "AI_POWERED" && (
        <div className="max-w-2xl mx-auto pt-6 border-t border-border">
          <ProductUpload />
        </div>
      )}
    </div>
  )
}