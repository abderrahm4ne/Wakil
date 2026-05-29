'use client';

import Link from 'next/link';
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
        </div>
      </div>
    </nav>
  );
}
