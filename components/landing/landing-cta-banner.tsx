'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingCtaBanner() {
  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 top-50 right-10 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center font-display">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Ready to automate your store?
        </h2>
        <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
          Start your 14-day free trial today. No credit card required. Full access to all features.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-secondary/70 to-green-600/45 text-white rounded-full font-semibold hover:shadow-sm hover:shadow-green-500/50 transition-all text-lg"
        >
          Start Your Free Trial Now <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
