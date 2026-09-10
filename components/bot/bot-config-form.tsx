"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Bot, Store, Phone, MapPin, Globe, Zap, Info, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

interface BotConfigFormProps {
  onSuccess: () => void
  initialData?: any
}

const LANGUAGES = [
  { value: "ARABIC", labelKey: "bot.lang.arabic", native: "العربية" },
  { value: "FRENCH", labelKey: "bot.lang.french", native: "Français" },
  { value: "DARIJA", labelKey: "bot.lang.darija", native: "دارجة", aiOnly: true },
]

export function BotConfigForm({ onSuccess, initialData }: BotConfigFormProps) {
  const { t, i18n } = useTranslation("dashboard")
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [typeChanged, setTypeChanged] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    type: initialData?.type ?? "RULE_BASED",
    languages: (initialData?.languages ?? []) as string[],
    storeName: initialData?.storeName ?? "",
    storeCity: initialData?.storeCity ?? "",
    storeContact: initialData?.storeContact ?? "",
    storeInfo: initialData?.storeInfo ?? "",
  })

  const isEditing = !!initialData
  const isAIPlan = plan === "PRO" || plan === "BUSINESS"

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((res) => { if (res.success) setPlan(res.data.plan) })
  }, [])

  const handleTypeChange = (newType: string) => {
    if (isEditing && newType !== formData.type) setTypeChanged(true)
    const langs = newType === "RULE_BASED"
      ? formData.languages.filter((l) => l !== "DARIJA")
      : formData.languages
    setFormData((prev) => ({ ...prev, type: newType, languages: langs }))
    setError(null)
  }

  const toggleLanguage = (lang: string) => {
    const isAiOnly = lang === "DARIJA"
    if (isAiOnly && formData.type === "RULE_BASED") {
      setError(t("bot.errors.darijaRequiresAI"))
      return
    }
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.storeName || !formData.storeCity || !formData.storeContact) {
      setError(t("bot.errors.missingFields"))
      return
    }
    if (formData.languages.length === 0) {
      setError(t("bot.errors.noLanguage"))
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/bot", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (!res.ok) {
        const errorMap: Record<string, string> = {
          AI_POWERED_REQUIRES_PRO_OR_BUSINESS: t("bot.errors.aiRequiresPro"),
          DARIJA_REQUIRES_AI_POWERED: t("bot.errors.darijaRequiresAI"),
          MISSING_FIELDS: t("bot.errors.missingFields"),
          BOT_ALREADY_EXISTS: t("bot.errors.alreadyExists"),
        }
        setError(errorMap[result.error] ?? t("bot.errors.generic"))
        return
      }

      toast.success(isEditing ? t("bot.updateSuccess") : t("bot.createSuccess"))
      onSuccess()
    } catch {
      setError(t("bot.errors.generic"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${i18n.language === 'ar' ? 'font-arabic' : 'font-display'} max-w-2xl mx-auto`}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4 mb-8"
      >
        <Link
          href="/dashboard/bot"
          className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
        >
          {i18n.language === 'ar' ? (<ArrowRight size={16} />) : (<ArrowLeft size={16} />)}
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {isEditing ? t("bot.editTitle") : t("bot.createTitle")}
          </h1>
          <p className="text-md font-medium text-muted-foreground mt-0.5">
            {isEditing ? t("bot.editSubtitle") : t("bot.createSubtitle")}
          </p>
        </div>
      </motion.div>


      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Bot type */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl border border-border bg-linear-to-tr from-black to-black/5 p-5 space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} className="text-secondary" />
            <p className="text-md font-medium text-foreground">{t("bot.typeLabel")}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "RULE_BASED", labelKey: "bot.type.ruleBased", descKey: "bot.type.ruleBasedDesc", available: true },
              { value: "AI_POWERED", labelKey: "bot.type.aiPowered", descKey: "bot.type.aiPoweredDesc", available: isAIPlan },
            ].map(({ value, labelKey, descKey, available }) => (
              <button
                key={value}
                type="button"
                disabled={!available}
                onClick={() => available && handleTypeChange(value)}
                className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'} p-4 rounded-xl border transition-all
                  ${formData.type === value
                    ? "border-secondary/50 bg-secondary/8"
                    : available
                    ? "border-border hover:border-muted-foreground/40 hover:cursor-pointer"
                    : "border-border opacity-40 cursor-not-allowed"
                  }`}
              >
                <p className="text-md font-medium text-foreground">{t(labelKey)}</p>
                <p className="text-[0.82rem] text-muted-foreground mt-1">{t(descKey)}</p>
                {!available && (
                  <span className="text-[10px] text-secondary font-medium mt-1 block">{t("bot.proPlusOnly")}</span>
                )}
              </button>
            ))}
          </div>

          {typeChanged && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20 text-amber-500 text-sm"
            >
              <Info size={13} className="mt-0.5 shrink-0" />
              {t("bot.typeChangeWarning")}
            </motion.div>
          )}
        </motion.div>


        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border border-border bg-linear-to-tr from-black to-black/5 p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-secondary" />
            <p className="text-md font-medium text-foreground">{t("bot.languagesLabel")}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(({ value, labelKey, native, aiOnly }) => {
              const isSelected = formData.languages.includes(value)
              const isDisabled = aiOnly && formData.type === "RULE_BASED"

              return (
                <button
                  key={value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleLanguage(value)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all
                    ${isSelected
                      ? "border-secondary/50 bg-secondary/10 text-secondary hover:cursor-pointer"
                      : isDisabled
                      ? "border-border text-muted-foreground/40 cursor-not-allowed"
                      : 
                      "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground hover:cursor-pointer"
                    }`}
                >
                  {native}
                  {aiOnly && (
                    <span className="ms-1.5 text-[10px] opacity-60">{t("bot.aiOnly")}</span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Store information */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-2xl border border-border bg-linear-to-tr from-black to-black/5 p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Store size={20} className="text-secondary" />
            <p className="text-md font-medium text-foreground">{t("bot.storeDetails")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Bot name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm text-muted-foreground">{t("bot.botName")}</label>
              <div className="relative">
                <Bot size={17} className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder={t("bot.botNamePlaceholder")}
                  className="w-full rounded-xl border border-border bg-background ps-9 pe-3 py-2.5 text-[0.92rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50 transition mt-1"
                />
              </div>
            </div>

            {/* Store name */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">{t("bot.storeName")}</label>
              <div className="relative">
                <Store size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={formData.storeName}
                  onChange={(e) => setFormData((p) => ({ ...p, storeName: e.target.value }))}
                  placeholder={t("bot.storeNamePlaceholder")}
                  className="w-full rounded-xl border border-border bg-background ps-9 pe-3 py-2.5 text-[0.92rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50 transition mt-1"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">{t("bot.storeCity")}</label>
              <div className="relative">
                <MapPin size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={formData.storeCity}
                  onChange={(e) => setFormData((p) => ({ ...p, storeCity: e.target.value }))}
                  placeholder={t("bot.storeCityPlaceholder")}
                  className="w-full rounded-xl border border-border bg-background ps-9 pe-3 py-2.5 text-[0.92rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50 transition mt-1"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm text-muted-foreground">{t("bot.storeContact")}</label>
              <div className="relative">
                <Phone size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={formData.storeContact}
                  onChange={(e) => setFormData((p) => ({ ...p, storeContact: e.target.value }))}
                  placeholder={t("bot.storeContactPlaceholder")}
                  className="w-full rounded-xl border border-border bg-background ps-9 pe-3 py-2.5 text-[0.92rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50 transition mt-1"
                />
              </div>
            </div>

            {/* Store info */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm text-muted-foreground">{t("bot.storeInfo")}</label>
              <textarea
                value={formData.storeInfo}
                onChange={(e) => setFormData((p) => ({ ...p, storeInfo: e.target.value }))}
                placeholder={t("bot.storeInfoPlaceholder")}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[0.92rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50 transition resize-none mt-1"
              />
              <p className="text-[0.8rem] text-muted-foreground">{t("bot.storeInfoHint")}</p>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-md"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex gap-3 pt-1"
        >
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-black text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50 transition-colors hover:cursor-pointer"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading
              ? t("bot.saving")
              : isEditing
              ? t("bot.saveChanges")
              : t("bot.createBot")}
          </button>
          <Link
            href="/dashboard/bot"
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors text-center"
          >
            {t("bot.cancel")}
          </Link>
        </motion.div>
      </form>
    </div>
  )
}