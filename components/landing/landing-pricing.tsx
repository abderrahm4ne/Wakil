'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free Trial',
    price: '0',
    period: '14 days',
    description: 'Perfect for testing',
    features: ['500 messages', 'Rule-based only', 'Single page', '1 bot'],
    badge: null,
    cta: 'Start Free Trial',
    highlighted: false
  },
  {
    name: 'Starter',
    price: '1,500',
    period: '/month',
    description: 'For small stores',
    features: ['2,000 messages/month', 'Rule-based only', 'Unlimited pages', '3 bots'],
    badge: null,
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '4,000',
    period: '/month',
    description: 'Most popular choice',
    features: ['10,000 messages/month', 'AI-powered automation', 'Unlimited pages', 'Unlimited bots', 'Smart escalation', 'Advanced analytics'],
    badge: 'Most Popular',
    cta: 'Get Started',
    highlighted: true
  },
  {
    name: 'Business',
    price: '9,000',
    period: '/month',
    description: 'For growing businesses',
    features: ['Unlimited messages', 'AI-powered automation', 'Unlimited pages', 'Unlimited bots', 'Priority support', 'Custom integrations'],
    badge: 'Best Value',
    cta: 'Get Started',
    highlighted: false
  }
];

export default function LandingPricing() {
  return (
    <section id="pricing" className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-neutral-400 text-lg">Choose the perfect plan for your business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden transition-all ${
                plan.highlighted
                  ? 'lg:scale-105 border-2 border-transparent bg-gradient-to-b from-neutral-900 to-neutral-800 shadow-2xl shadow-cyan-500/20'
                  : 'border border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-800'
              }`}
              style={plan.highlighted ? {
                backgroundImage: 'linear-gradient(135deg, #0f1117, #1a1d27), linear-gradient(135deg, #00d4aa, #4f8ef7)',
                backgroundClip: 'padding-box, border-box',
                backgroundOrigin: 'padding-box, border-box',
                borderImage: 'linear-gradient(135deg, #00d4aa, #4f8ef7) 1'
              } : {}}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-neutral-400 text-sm mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-neutral-400 ml-1">DZD{plan.period}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all mb-6 block text-center ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                      : 'border border-neutral-600 text-white hover:border-neutral-500'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
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
