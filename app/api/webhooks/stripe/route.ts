import { metadata } from '@/app/layout'
import { stripe } from '@/lib/stripe'
import { activateSubscription, syncSubscriptionPeriod, OneTimePayement } from '@/lib/subscription'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')!
    console.log('reached webhook')
    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    }
    catch (err) {
        console.error('Webhook signature verification failed', err)
        return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 400 })
    }
    try{
        switch(event.type){
            case'payment_intent.succeeded': {
                const paymentIntent = event.data.object as any
                const metadata = paymentIntent.metadata ?? {}
                // console.log('one time sub gene : ', metadata)
                if (metadata.billingMode === 'ONE_TIME') {
                    const userId = metadata.userId
                    const plan = metadata.plan
                    const customerId = paymentIntent.customer as string | null
                    const now = new Date()
                    const expiresAt = new Date(now)
                    expiresAt.setDate(expiresAt.getDate() + 30)

                    if (userId && plan && customerId) {
                        await OneTimePayement(userId, plan as any, customerId, expiresAt, now)
                    }
                }
                break
            }

            case 'checkout.session.completed': {
                const session = event.data.object
                const userId = session.metadata?.userId       
                /* console.log('DEBUG session:', JSON.stringify({
                    userId: session.client_reference_id,
                    plan: session.metadata?.plan,
                    sub: session.subscription,
                    customer: session.customer
                }))*/ 
                const plan = session.metadata?.plan
                const providerSubscriptionId = session.subscription as string
                const providerCustomerId = session.customer as string
                console.log('metadata: ', session.metadata)
                if (userId && plan && providerSubscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(providerSubscriptionId)
                    const item = subscription.items.data[0]
                    await activateSubscription(
                    userId, 
                    plan as any, 
                    providerSubscriptionId, 
                    providerCustomerId,
                    new Date(item.current_period_end * 1000),
                    new Date(item.current_period_start * 1000)
                    )
                }
                break
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object
                const item = subscription.items.data[0]
                const priceId = item.price.id
                const planMap: Record<string, string> = {
                    [process.env.STRIPE_STARTER_PRICE_ID!]: 'STARTER',
                    [process.env.STRIPE_PRO_PRICE_ID!]: 'PRO',
                    [process.env.STRIPE_BUSINESS_PRICE_ID!]: 'BUSINESS',
                }
                const plan = planMap[priceId]
                await syncSubscriptionPeriod(subscription.id, {
                    currentPeriodEnd: new Date(item.current_period_end * 1000),
                    currentPeriodStart: new Date(item.current_period_start * 1000),
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    status: subscription.status,
                    plan: plan || undefined
                })
                break
            }

            case 'invoice.payment_failed': {
            const invoice = event.data.object as any
            const subscriptionId = invoice.subscription as string

                await syncSubscriptionPeriod(subscriptionId as string, {
                    currentPeriodEnd: new Date(invoice.period_end * 1000),
                    currentPeriodStart: new Date(invoice.period_start * 1000),
                    cancelAtPeriodEnd: false,
                    status: 'past_due',
                })
                break
            }
        }

        return NextResponse.json({ received: true })
    } 
    catch (err) {
        console.error(`Webhook handler failed for event ${event.type} (${event.id})`, err)
        return NextResponse.json({ received: true, error: 'HANDLER_FAILED' }, { status: 200 })
    }
}