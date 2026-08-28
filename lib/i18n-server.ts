import i18n from 'i18next';

import landingFr from '@/locales/fr/landing.json';
import landingAr from '@/locales/ar/landing.json';
import landingEn from '@/locales/en/landing.json';

import authFr from '@/locales/fr/auth.json';
import authAr from '@/locales/ar/auth.json';
import authEn from '@/locales/en/auth.json';

import dashboardFr from '@/locales/fr/dashboard.json';
import dashboardAr from '@/locales/ar/dashboard.json';
import dashboardEn from '@/locales/en/dashboard.json';

i18n.init({
    resources: {
        fr: {
            landing: landingFr,
            auth: authFr,
            dashboard: dashboardFr,
        },
        ar: {
            landing: landingAr,
            auth: authAr,
            dashboard: dashboardAr,
        },
        en: {
            landing: landingEn,
            auth: authEn,
            dashboard: dashboardEn,
        },
    },

    fallbackLng: 'fr',

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;