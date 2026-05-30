'use client';

import { Settings, Link as LinkIcon, Zap } from 'lucide-react';

const steps = [
  {
    icon: Settings,
    number: '1',
    title: 'Create Your Bot',
    description: 'Configure your bot name, language, and automation rules'
  },
  {
    icon: LinkIcon,
    number: '2',
    title: 'Connect Your Page',
    description: 'Link your Instagram & Facebook pages in one click'
  },
  {
    icon: Zap,
    number: '3',
    title: 'Instant Replies',
    description: 'Your customers get instant, intelligent responses 24/7'
  }
];

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 font-display">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-neutral-400 text-lg">Get started in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting lines  */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-1 bg-linear-to-r from-transparent via-cyan-600/50 to-transparent -z-10"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                {/* Step Circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-secondary/70 to-green-600/45 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border-2 border-green-600/75 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 text-center">{step.title}</h3>
                <p className="text-neutral-400 text-center">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
