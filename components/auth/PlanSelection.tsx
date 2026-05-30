"use client"


import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PlanSelectionProps {
    selected: string
    onSelect: (plan: string) => void
}

export function PlanSelection({ selected, onSelect }: PlanSelectionProps) {
    const { t } = useTranslation(['auth', 'landing'])

    const plans = [
        {
            id: "0",
            name: "FreeTrial",
            price: 0,
            description: t('pricing.plans.free.description', { ns: 'landing' }),
            features: t('pricing.plans.free.features', { ns: 'landing', returnObjects: true }) as string[],
            popular: false,
        },{
            id: "1",
            name: "Starter",
            price: 1500,
            description: t('pricing.plans.starter.description', { ns: 'landing' }),
            features: t('pricing.plans.starter.features', { ns: 'landing', returnObjects: true }) as string[],
            popular: false,
        },
        {
            id: "2",
            name: "Pro",
            price: 4000,
            description: t('pricing.plans.pro.description', { ns: 'landing' }),
            features: t('pricing.plans.pro.features', { ns: 'landing', returnObjects: true }) as string[],
            popular: true,
        },
        {
            id: "3",
            name: "Business",
            price: 9000,
            description: t('pricing.plans.business.description', { ns: 'landing' }),
            features: t('pricing.plans.business.features', { ns: 'landing', returnObjects: true }) as string[],
            popular: false,
        },
    ]

    return (
      <div
          className="w-full h-full flex flex-col justify-center items-center py-7 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="sm:w-[85%] w-full space-y-4">
            <div className="space-y-1 place-self-center">
              <h2 className="font-bold md:text-3xl text-xl font-sans tracking-tight">{t('pricing.title', { ns: 'landing' })}</h2>
              <p className="text-xs text-muted-foreground">{t('pricing.subtitle', { ns: 'landing' })}</p>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              {plans.map((tier) => {
                const isSelected = selected === tier.name
                return (
                <div
                    key={tier.name}
                    onClick={() => onSelect(tier.name)}
                    className="flex flex-col space-y-2 relative rounded-lg border px-5 pt-5 pb-3 transition-all duration-200 cursor-pointer"
                    style={{
                        backgroundColor: isSelected 
                            ? 'var(--accent)' 
                            : 'rgba(0,212,170,0.1)',
                        borderColor: isSelected 
                            ? '#02a5c2' 
                            : 'var(--border)',
                    }}
                >
                  {tier.popular && (
                      <div className="absolute -top-2 left-4">
                          <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {t('pricing.plans.pro.badge', { ns: 'landing' })}
                          </span>
                      </div>
                    )}
                <div className="flex justify-between items-center font-display ">
                    <h3 className="font-semibold">{tier.name}</h3>
                    <h3 className="font-bold">{tier.price} DZD</h3>
                </div>
                
                <h4 className="text-muted-foreground text-sm font-sans tracking-tight">{tier.description}</h4>

                <ul className="space-y-1">
                    {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground ">
                            <Check className="h-3 w-3 text-emerald-600 " />
                            {feature}
                        </li>
                    ))}
                  </ul>



                </div>)
              })}
            </div>
          </div>
        </div>
    )
}
