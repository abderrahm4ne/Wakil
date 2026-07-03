'use client';

import Link from 'next/link';
<<<<<<< HEAD
import { MessageCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingNavbar() {
  const { t, i18n } = useTranslation('landing');

  const toggleLanguage = () => {
    const langs = ['fr', 'en', 'ar'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto ">
        <div className="flex items-center justify-around h-16">
          
          {/* Logo */}
          <Link href="/" className="flex gap-2 font-semibold text-xl ">
            <div className="w-8 h-8 bg-linear-to-br from-secondary/70 to-green-600/90 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">Wakil</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex flex-1 justify-center gap-6 ">
            <Link href="#features" className="text-neutral-400 hover:text-white transition-colors">
              {t('navbar.features')}
            </Link>
            <Link href="#pricing" className="text-neutral-400 hover:text-white transition-colors">
              {t('navbar.pricing')}
            </Link>
            <Link href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">
              {t('navbar.howItWorks')}
            </Link>
          </div>

          <div className="flex  justify-end gap-4 ">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors px-3 py-1 rounded-md border border-neutral-800 hover:cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium uppercase">{i18n.language}</span>
            </button>

            {/* CTA Button */}
            <Link
              href="/register"
              className="px-3 py-2 bg-linear-to-r from-secondary/70 to-green-600/45 text-white text-[0.9rem] rounded-full font-semibold hover:shadow-sm hover:shadow-green-300/50 transition-all"
            >
              {t('navbar.startFreeTrial')}
            </Link>
          </div>
=======
import { MessageCircle } from 'lucide-react';

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <div className="w-8 h-8 bg-linear-to-br from-secondary/70 to-green-600/90 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">Botify</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6">
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
            className="px-6 py-2.5 bg-linear-to-r from-secondary/70 to-green-600/45 text-white rounded-full font-semibold hover:shadow-sm hover:shadow-cyan-500/50 transition-all"
          >
            Start Free Trial
          </Link>
>>>>>>> 725af48 ( style: working on home page sections)
        </div>
      </div>
    </nav>
  );
}
