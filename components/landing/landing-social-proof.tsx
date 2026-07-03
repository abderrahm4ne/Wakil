'use client';

import { MessageSquare, Zap, Clock } from 'lucide-react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';

export default function LandingSocialProof() {
  const { t } = useTranslation('landing');

=======

export default function LandingSocialProof() {
>>>>>>> 725af48 ( style: working on home page sections)
  return (
    <section className="bg-black border-y border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-neutral-400 mb-8">
<<<<<<< HEAD
          {t('socialProof.trustedBy')}
=======
          Trusted by merchants in Algiers, Oran, Constantine & beyond
>>>>>>> 725af48 ( style: working on home page sections)
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Metric 1 */}
          <div className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <MessageSquare className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">500+</div>
<<<<<<< HEAD
            <p className="text-neutral-400">{t('socialProof.merchants')}</p>
=======
            <p className="text-neutral-400">Active Merchants</p>
>>>>>>> 725af48 ( style: working on home page sections)
          </div>

          {/* Metric 2 */}
          <div className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Zap className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">2M+</div>
<<<<<<< HEAD
            <p className="text-neutral-400">{t('socialProof.messages')}</p>
=======
            <p className="text-neutral-400">Messages Handled</p>
>>>>>>> 725af48 ( style: working on home page sections)
          </div>

          {/* Metric 3 */}
          <div className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{'<'}2s</div>
<<<<<<< HEAD
            <p className="text-neutral-400">{t('socialProof.responseTime')}</p>
=======
            <p className="text-neutral-400">Response Time</p>
>>>>>>> 725af48 ( style: working on home page sections)
          </div>
        </div>
      </div>
    </section>
  );
}
