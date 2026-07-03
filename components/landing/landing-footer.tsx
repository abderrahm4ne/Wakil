'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingFooter() {
  const { t } = useTranslation('landing');

  return (
    <footer className="bg-black border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Wakil</span>
            </Link>
            <p className="text-neutral-400 text-sm">{t('hero.description')}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="text-neutral-400 hover:text-white transition-colors">{t('navbar.features')}</Link></li>
              <li><Link href="#pricing" className="text-neutral-400 hover:text-white transition-colors">{t('navbar.pricing')}</Link></li>
              <li><Link href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">{t('navbar.howItWorks')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.product')}</h4>
            <Link
              href="/register"
              className="inline-block px-4 py-2 bg-linear-to-r from-secondary/70 to-green-600/45 text-white rounded-lg font-semibold hover:shadow-sm hover:shadow-green-500/50 transition-all text-sm"
            >
              {t('navbar.startFreeTrial')}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center ">
          <p className="text-neutral-500 text-sm">© 2026 Wakil. {t('footer.rights')}.</p>
          <p className="text-neutral-500 text-sm mt-4 sm:mt-0">{t('footer.madeIn')} </p>
        </div>
      </div>
    </footer>
  );
}
