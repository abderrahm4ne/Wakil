import { cookies } from "next/headers"

export type Language = "en" | "fr" | "ar"

export default async function getLang(): Promise<Language> {
  const cookieStore = await cookies()
  const locale = cookieStore.get("locale")?.value

  if (locale === "en" || locale === "fr" || locale === "ar") {
    return locale
  }

  return "en"
}