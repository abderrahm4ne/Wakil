'use client';

import Link from 'next/link';
<<<<<<< HEAD
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingCtaBanner() {
  const { t } = useTranslation('landing');

  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 top-50 right-10 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center font-display">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {t('ctaBanner.title')}
        </h2>
        <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
          {t('ctaBanner.subtitle')}
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-secondary/70 to-green-600/45 text-white rounded-full font-semibold hover:shadow-sm hover:shadow-green-500/50 transition-all text-lg"
        >
          {t('ctaBanner.cta')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
      </div>
    </section>
=======
import { MessageCircle } from 'lucide-react';

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">Botify</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-neutral-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-neutral-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">
              How it works
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/register"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
>>>>>>> 725af48 ( style: working on home page sections)
  );
}
