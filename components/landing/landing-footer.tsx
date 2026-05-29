'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-black border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-white">Botify</span>
            </Link>
            <p className="text-neutral-400 text-sm">AI-powered chatbot for Algerian e-commerce merchants</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-neutral-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-neutral-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">How it Works</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get Started</h4>
            <Link
              href="/register"
              className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">© 2024 Botify. All rights reserved.</p>
          <p className="text-neutral-500 text-sm mt-4 sm:mt-0">Made in Algeria 🇩🇿</p>
        </div>
      </div>
    </footer>
  );
}
