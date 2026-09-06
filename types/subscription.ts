import { features } from "process";

export const subscriptions = [
        {
            id: "0",
            plan: "FREE_TRIAL",
            name: "FreeTrial",
            nameKey: 'pricing.plans.free.name',
            price: 0,
            limit: 500,
            productLimit: 50,
            features: [
                "pricing.plans.free.feat.0", 
                "pricing.free.free.feat.1", 
                "pricing.free.free.feat.2"
            ]
        },{
            id: "1",
            plan: "STARTER",
            name: "Starter",
            nameKey: 'pricing.plans.starter.name',
            price: 2500,
            limit: 2000,
            productLimit: 150,
            features: [
            "pricing.plans.starter.feat.0",
            "pricing.plans.starter.feat.1",
            "pricing.plans.starter.feat.2",
            "pricing.plans.starter.feat.3"
            ]
        },
        {
            id: "2",
            plan: "PRO",
            name: "Pro",
            nameKey: 'pricing.plans.pro.name',
            price: 5500,
            limit: 10000,
            productLimit: 400,
            features: [
                'pricing.plans.pro.feat.0', 
                'pricing.plans.pro.feat.1', 
                'pricing.plans.pro.feat.2', 
                'pricing.plans.pro.feat.3', 
                'pricing.plans.pro.feat.4'
                ]
            },
        {
            id: "3",
            plan: "BUSINESS",
            name: "Business",
            nameKey: 'pricing.plans.business.name',
            price: 12000,
            limit: null,
            productLimit: null,
            features: [
            'pricing.plans.business.feat.0', 
            'pricing.plans.business.feat.1', 
            'pricing.plans.business.feat.2', 
            'pricing.plans.business.feat.3' 
            ]
        },
    ]