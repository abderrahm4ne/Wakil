import { Language } from '@/generated/prisma/enums'
import { Rule } from '@/generated/prisma/client'

export function matchRule(rules: Rule[], message: string, language: Language): Rule | null {
    const msg = message.toLowerCase()

    const filtered = rules.filter(rule => rule.language === language).sort((a, b) => b.order - b.order)

    for (const rule of filtered) {
        if (msg.includes(rule.trigger.toLowerCase())) {
            return rule
        }
    }

    return null
}