'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingPricing() {
  const { t } = useTranslation('landing');

  const plans = [
    {
      name: t('pricing.plans.free.name'),
      price: '0',
      period: t('pricing.plans.free.period'),
      description: t('pricing.plans.free.description'),
      features: t('pricing.plans.free.features', { returnObjects: true }) as string[],
      badge: null,
      cta: t('pricing.plans.free.cta'),
      highlighted: false
    },
    {
      name: t('pricing.plans.starter.name'),
      price: '1,500',
      period: t('pricing.plans.starter.period'),
      description: t('pricing.plans.starter.description'),
      features: t('pricing.plans.starter.features', { returnObjects: true }) as string[],
      badge: null,
      cta: t('pricing.plans.starter.cta'),
      highlighted: false
    },
    {
      name: t('pricing.plans.pro.name'),
      price: '4,000',
      period: t('pricing.plans.pro.period'),
      description: t('pricing.plans.pro.description'),
      features: t('pricing.plans.pro.features', { returnObjects: true }) as string[],
      badge: t('pricing.plans.pro.badge'),
      cta: t('pricing.plans.pro.cta'),
      highlighted: true
    },
    {
      name: t('pricing.plans.business.name'),
      price: '9,000',
      period: t('pricing.plans.business.period'),
      description: t('pricing.plans.business.description'),
      features: t('pricing.plans.business.features', { returnObjects: true }) as string[],
      badge: t('pricing.plans.business.badge'),
      cta: t('pricing.plans.business.cta'),
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-center max-w-6xl mx-auto">
        <div className="text-center mb-16 font-display">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-neutral-400 text-lg">{t('pricing.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden transition-all ${
                plan.highlighted
                  ? 'lg:scale-105 border-2 border-transparent shadow-lg shadow-cyan-700/20'
                  : 'border border-neutral-700 bg-linear-to-b from-neutral-900 to-neutral-800'
              }`}
              style={plan.highlighted ? {
                backgroundImage: 'linear-gradient(135deg, #000b06, #00160c), linear-gradient(135deg, #0c854b, #0bf183)',
                backgroundClip: 'padding-box, border-box',
                backgroundOrigin: 'padding-box, border-box',
              } : {}}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-linear-to-r from-secondary/70 to-green-600/45 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-neutral-400 text-sm mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-neutral-400 ml-1">DZD{plan.period}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all mb-6 block text-center ${
                    plan.highlighted
                      ? 'bg-linear-to-r from-secondary/70 to-green-600/45 text-white hover:shadow-sm hover:shadow-green-200/50'
                      : 'border border-neutral-600 text-white hover:border-neutral-500'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-neutral-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
