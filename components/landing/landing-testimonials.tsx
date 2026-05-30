'use client';

import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingTestimonials() {
  const { t } = useTranslation('landing');

  const testimonials = t('testimonials.items', { returnObjects: true }) as Array<{
    name: string;
    role: string;
    content: string;
  }>;

  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 font-display">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-neutral-400 text-lg">{t('testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="backdrop-blur-sm bg-white/10 border border-border rounded-xl p-6 hover:border-green-500/50 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-neutral-200 mb-6 italic">"{testimonial.content}"</p>

              {/* Author */}
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-neutral-400 text-xs">{testimonial.role}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
