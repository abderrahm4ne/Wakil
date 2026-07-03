'use client';

import { Star } from 'lucide-react';
<<<<<<< HEAD
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
=======

const testimonials = [
  {
    name: 'Fatima Benali',
    role: 'Fashion Store Owner, Algiers',
    content: 'Botify a complètement changé ma façon de gérer mes commandes. Je réponds maintenant à 10x plus de clients en même temps, tout en dormant! Mes ventes ont augmenté de 40% en deux mois.',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    name: 'Karim Djakoum',
    role: 'Electronics Seller, Oran',
    content: 'L\'IA comprend le Darija et l\'arabe parfaitement. Mes clients se sentent respectés quand le bot répond dans leur langue maternelle. C\'est incroyable pour la confiance et les conversions!',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    name: 'Leila Chabane',
    role: 'Beauty Products Entrepreneur, Constantine',
    content: 'Le setup a pris 3 minutes, pas plus! Pas besoin de développeur ou de configuration compliquée. Juste brancher mon Facebook et c\'était parti. Meilleur investissement pour mon business.',
    rating: 5,
    avatar: '👩‍🔬'
  }
];

export default function LandingTestimonials() {
  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Loved by Algerian Merchants
          </h2>
          <p className="text-neutral-400 text-lg">See what our customers are saying</p>
>>>>>>> 725af48 ( style: working on home page sections)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
<<<<<<< HEAD
              className="backdrop-blur-sm bg-white/10 border border-border rounded-xl p-6 hover:border-green-500/50 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
=======
              className="backdrop-blur-sm bg-white/10 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
>>>>>>> 725af48 ( style: working on home page sections)
                ))}
              </div>

              {/* Quote */}
              <p className="text-neutral-200 mb-6 italic">"{testimonial.content}"</p>

              {/* Author */}
<<<<<<< HEAD
=======
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
>>>>>>> 725af48 ( style: working on home page sections)
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-neutral-400 text-xs">{testimonial.role}</p>
                </div>
<<<<<<< HEAD
=======
              </div>
>>>>>>> 725af48 ( style: working on home page sections)
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
