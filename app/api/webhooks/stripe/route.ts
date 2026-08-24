import { stripe } from '@/lib/stripe'
import { activateSubscription, syncSubscriptionPeriod } from '@/lib/subscription'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')!
    console.log('reached webhook')
    let event
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
        console.error('Webhook signature verification failed', err)
        return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 400 })
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId = session.client_reference_id        
        /* console.log('DEBUG session:', JSON.stringify({
            userId: session.client_reference_id,
            plan: session.metadata?.plan,
            sub: session.subscription,
            customer: session.customer
        })) */
        const plan = session.metadata?.plan
        const providerSubscriptionId = session.subscription as string
        const providerCustomerId = session.customer as string

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

    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object
        const item = subscription.items.data[0]
        await syncSubscriptionPeriod(subscription.id, {
            currentPeriodEnd: new Date(item.current_period_end * 1000),
            currentPeriodStart: new Date(item.current_period_start * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            status: subscription.status, // active, past_due, canceled, unpaid...
        })
    }

    return NextResponse.json({ received: true })
}