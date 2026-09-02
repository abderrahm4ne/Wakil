import LandingNavbar from '@/components/landing/landing-navbar';
import LandingHero from '@/components/landing/landing-hero';
import LandingSocialProof from '@/components/landing/landing-social-proof';
import LandingFeatures from '@/components/landing/landing-features';
import LandingHowItWorks from '@/components/landing/landing-how-it-works';
import LandingPricing from '@/components/landing/landing-pricing';
import LandingTestimonials from '@/components/landing/landing-testimonials';
import LandingCtaBanner from '@/components/landing/landing-cta-banner';
import LandingFooter from '@/components/landing/landing-footer';
import i18n from '@/lib/i18n';
import getLang from '@/lib/locale';



export const metadata = {
  title: 'Wakil - AI Chatbot for Algerian E-commerce Merchants',
  description: 'Automate your Instagram & Facebook DMs with AI-powered replies in Arabic, French, and Darija. Start your 14-day free trial today.',
};

export default async function HomePage() {
    const lang = await getLang()
  
  return (
    <div className={`bg-black ${lang === 'ar' ? 'font-arabic' : 'font-display'}`}>
      <LandingNavbar />
      <LandingHero />
      <LandingSocialProof />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingPricing />
      <LandingTestimonials />
      <LandingCtaBanner />
      <LandingFooter />
    </div>
  );
}
