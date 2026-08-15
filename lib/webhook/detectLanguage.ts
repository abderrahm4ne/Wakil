// lib/webhook/detectLanguage.ts
import { Language } from '@/generated/prisma/enums'

const ARABIC_RANGE = /[\u0600-\u06FF\u0750-\u077F]/

const FRENCH_MARKERS = ['bonjour', 'merci', 'prix', 'combien', 'salut', 'svp', 'commande', 'livraison']
const DARIJA_MARKERS = ['kayn', 'wach', 'chhal', 'bghit', 'labas', 'rigel', '3andkoum', '3la', 'khoya', 'hbb', 'kayn']

export function detectLanguage(message: string, botLanguages: Language[]): Language {
    const msg = message.toLowerCase()

    if (ARABIC_RANGE.test(msg)) {
        return Language.ARABIC
    }

    if (DARIJA_MARKERS.some(m => msg.includes(m)) && botLanguages.includes(Language.DARIJA)) {
        return Language.DARIJA
    }

    if (FRENCH_MARKERS.some(m => msg.includes(m)) && botLanguages.includes(Language.FRENCH)) {
        return Language.FRENCH
    }

    return botLanguages[0]
}