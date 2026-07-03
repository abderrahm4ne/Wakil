'use client';

import { MessageSquare, Zap, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingSocialProof() {
  const { t } = useTranslation('landing');

  return (
    <section className="bg-black border-y border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-neutral-400 mb-8">
          {t('socialProof.trustedBy')}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Metric 1 */}
          <div className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <MessageSquare className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <p className="text-neutral-400">{t('socialProof.merchants')}</p>
          </div>

          {/* Metric 2 */}
          <div className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Zap className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">2M+</div>
            <p className="text-neutral-400">{t('socialProof.messages')}</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{'<'}2s</div>
            <p className="text-neutral-400">{t('socialProof.responseTime')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
