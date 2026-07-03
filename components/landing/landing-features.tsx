'use client';

import { Globe, Bot, MessageCircle, BarChart3, Zap, Bell } from 'lucide-react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';

export default function LandingFeatures() {
  const { t } = useTranslation('landing');

  const features = [
    {
      icon: Globe,
      title: t('features.items.multilingual.title'),
      description: t('features.items.multilingual.description')
    },
    {
      icon: Bot,
      title: t('features.items.ai.title'),
      description: t('features.items.ai.description')
    },
    {
      icon: MessageCircle,
      title: t('features.items.meta.title'),
      description: t('features.items.meta.description')
    },
    {
      icon: BarChart3,
      title: t('features.items.analytics.title'),
      description: t('features.items.analytics.description')
    },
    {
      icon: Zap,
      title: t('features.items.setup.title'),
      description: t('features.items.setup.description')
    },
    {
      icon: Bell,
      title: t('features.items.escalation.title'),
      description: t('features.items.escalation.description')
    }
  ];

=======

const features = [
  {
    icon: Globe,
    title: 'Multilingual Replies',
    description: 'Arabic, French, and Darija support for seamless communication'
  },
  {
    icon: Bot,
    title: 'Rule-Based or AI',
    description: 'Choose your automation style based on your business needs'
  },
  {
    icon: MessageCircle,
    title: 'Facebook & Instagram',
    description: 'Manage all your DMs in one unified dashboard'
  },
  {
    icon: BarChart3,
    title: 'Usage Analytics',
    description: 'Track your messages and bot performance monthly'
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Connect your pages in under 5 minutes, no coding required'
  },
  {
    icon: Bell,
    title: 'Smart Escalation',
    description: 'Get notified instantly when your bot needs human help'
  }
];

export default function LandingFeatures() {
>>>>>>> 725af48 ( style: working on home page sections)
  return (
    <section id="features" className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
<<<<<<< HEAD
          <h2 className="text-4xl sm:text-5xl font-display font-semibold text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground text-lg font-display">{t('features.subtitle')}</p>
=======
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Powerful Features for Smart Merchants
          </h2>
          <p className="text-neutral-400 text-lg">Everything you need to automate your customer support</p>
>>>>>>> 725af48 ( style: working on home page sections)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
<<<<<<< HEAD
                className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-border rounded-xl p-6 hover:border-green-200/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-linear-to-br from-secondary/70 to-green-600/45 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-sm group-hover:shadow-green-200/20 transition-shadow">
=======
                className="bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-linear-to-br from-secondary/70 to-green-600/45 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-sm group-hover:shadow-cyan-500/50 transition-shadow">
>>>>>>> 725af48 ( style: working on home page sections)
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
