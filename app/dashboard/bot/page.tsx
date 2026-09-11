"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Settings, Store, Globe, Phone, Bot, Zap, ArrowRight, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import Welcoming from "@/components/dashboard/page-title"

type BotData = {
  id: string
  name: string
  type: "RULE_BASED" | "AI_POWERED"
  languages: string[]
  isActive: boolean
  storeName: string
  storeCity: string
  storeContact: string
  storeInfo?: string
  createdAt: string
}



export default function BotPage() {
  const { t, i18n } = useTranslation("dashboard")
  const [bot, setBot] = useState<BotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  const LANGUAGE_LABELS: Record<string, string> = {
    ARABIC: i18n.language === 'ar' ? "العربية" : "Arabic",
    FRENCH: "Français",
    DARIJA: i18n.language === 'ar' ? "دارجة" : "Darija",
  }

  useEffect(() => {
    fetch("/api/bot")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setBot(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async () => {
    if (!bot) return
    setToggling(true)
    try {
      const res = await fetch("/api/bot/activate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !bot.isActive }),
      })
      const result = await res.json()
      if (result.success) {
        setBot((prev) => prev ? { ...prev, isActive: !prev.isActive } : prev)
        toast.success(bot.isActive ? t("bot.deactivated") : t("bot.activated"))
      } else {
        toast.error(result.error === "SUBSCRIPTION_INACTIVE" ? t("bot.subscriptionInactive") : t("bot.toggleError"))
      }
    } catch {
      toast.error(t("bot.toggleError"))
    } finally {
      setToggling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-secondary" />
      </div>
    )
  }

  if (!bot) {
    return (
      <div className={`flex flex-col ${i18n.language === 'ar' ? 'font-arabic' : 'font-display'} h-[70vh] items-center justify-center gap-6 text-center font-display`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted/40 border border-border flex items-center justify-center">
            <Bot className="h-9 w-9 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t("bot.notConfigured")}</h2>
            <p className="text-muted-foreground text-sm max-w-sm">{t("bot.notConfiguredDescription")}</p>
          </div>
          <Link
            href="/dashboard/bot/settings"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-black text-sm font-semibold hover:bg-secondary/90 transition-colors"
          >
            {t("bot.configure")} <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`${i18n.language === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col space-y-8`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <Welcoming title="bot.title" subTitle="bot.subtitle" />
        <Link
          href="/dashboard/bot/settings"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
        >
          <Settings size={15} />
          {t("bot.settings")}
        </Link>
      </div>

      {/* Status banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`relative overflow-hidden rounded-2xl border px-6 py-5 flex items-center justify-between gap-4
          ${bot.isActive
            ? "border-secondary/30 bg-secondary/5"
            : "border-border bg-muted/10"
          }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            {bot.isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-60" />
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3  ${bot.isActive ? "bg-secondary" : "bg-muted-foreground"}`} />
          </div>
          <div>
            <p className={`text-md font-semibold text-foreground font-display`}>
              {bot.name}
            </p>
            <p className="text-sm font-medium+ text-muted-foreground mt-0.5">
              {bot.isActive ? t("bot.activeDescription") : t("bot.inactiveDescription")}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={toggling}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/40 transition-colors disabled:opacity-50 hover:cursor-pointer"
        >
          {toggling ? (
            <Loader2 size={15} className="animate-spin" />
          ) : bot.isActive ? (
            <ToggleRight size={18} className="text-secondary" />
          ) : (
            <ToggleLeft size={18} className="text-muted-foreground" />
          )}
          {bot.isActive ? t("bot.deactivate") : t("bot.activate")}
        </button>
      </motion.div>

      {/* Info cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            icon: Store,
            label: t("bot.store"),
            value: bot.storeName,
            sub: `${bot.storeCity}, Algeria`,
            delay: 0.05,
          },
          {
            icon: Phone,
            label: t("bot.contact"),
            value: bot.storeContact,
            sub: null,
            delay: 0.1,
          },
          {
            icon: Zap,
            label: t("bot.mode"),
            value: bot.type === "AI_POWERED" ? t("bot.aiPowered") : t("bot.ruleBased"),
            sub: bot.type === "AI_POWERED" ? t("bot.aiDescription") : t("bot.rulesDescription"),
            delay: 0.15,
          },
        ].map(({ icon: Icon, label, value, sub, delay }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-linear-to-tr from-black to-black/5 px-5 py-5 flex flex-col gap-3"
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/15" />
            <Icon size={24} className="text-secondary relative" />
            <div className="relative">
              <p className="text-sm font-normal text-muted-foreground mb-1">{label}</p>
              <p className="text-base font-semibold text-foreground">{value}</p>
              {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Languages */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="rounded-2xl border border-border bg-linear-to-tr from-black to-black/5 px-6 py-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe size={24} className="text-secondary" />
          <p className="text-md font-medium text-foreground">{t("bot.languages")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {bot.languages.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-[0.88rem] font-medium"
            >
              {LANGUAGE_LABELS[lang] ?? lang}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Store info */}
      {bot.storeInfo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="rounded-2xl border border-border bg-linear-to-tr from-black to-black/5 px-6 py-5"
        >
          <p className="text-xs text-muted-foreground mb-2">{t("bot.additionalInfo")}</p>
          <p className="text-sm text-foreground leading-relaxed">{bot.storeInfo}</p>
        </motion.div>
      )}
    </div>
  )
}