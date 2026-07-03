'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';

export default function LandingHero() {
  const { t } = useTranslation('landing');

  return (
    <section className="min-h-screen bg-black pt-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden ">
      {/* Gradient Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-40 -left-40 w-80 h-80 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
        <div className="absolute -right-40 w-80 h-80 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
=======

export default function LandingHero() {
  return (
    <section className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -right-40 w-80 h-80 bg-cyan-600 rounded-full blur-3xl"></div>
>>>>>>> 725af48 ( style: working on home page sections)
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Tagline */}
        <div className="text-center mb-8">
<<<<<<< HEAD
          <span className="inline-block px-3 py-1 bg-secondary/70 text-green-200 text-sm rounded-full border border-green-200 font-display">
            {t('hero.tagline')}
=======
          <span className="inline-block px-3 py-1 bg-secondary/50 text-green-200 text-sm rounded-full border border-green-200">
            AI-Powered DM Assistant
>>>>>>> 725af48 ( style: working on home page sections)
          </span>
        </div>

        {/* Headline */}
<<<<<<< HEAD
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-center mb-6 leading-tight font-display">
          {t('hero.title1')}{' '}
          <span className="bg-linear-to-r from-secondary/70 to-green-600/45 bg-clip-text text-transparent">
            {t('hero.title2')}
          </span>{' '}
          {t('hero.title3')}
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto font-display">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 font-display">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-linear-to-r from-secondary/70 to-green-600/45
             text-white rounded-full font-semibold hover:shadow-sm hover:shadow-green-200/50 transition-all flex items-center gap-2"
          >
            {t('hero.cta')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-3.5 border border-border/60 text-white rounded-full font-semibold hover:border-border transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> {t('hero.secondaryCta')}
=======
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-center mb-6 leading-tight">
          Automate Your DMs.{' '}
          <span className="bg-linear-to-r from-secondary/70 to-green-600/45 bg-clip-text text-transparent">
            Sell More.
          </span>{' '}
          Sleep Better.
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
          AI-powered chatbot for Algerian merchants on Instagram & Facebook. Reply instantly in Arabic, French, and Darija.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-linear-to-r from-secondary/70 to-green-600/45
             text-white rounded-full font-semibold hover:shadow-sm hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-3.5 border border-neutral-700 text-white rounded-full font-semibold hover:border-neutral-500 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> See How It Works
>>>>>>> 725af48 ( style: working on home page sections)
          </Link>
        </div>

      </div>
    </section>
  );
}
