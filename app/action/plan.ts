"use server"
import {prisma} from '@/lib/prisma'

export async function planChecking(userId: string | undefined):Promise<Boolean>{
    const subscription = await prisma.subscription.findUnique({
        where: { userId }
    })
    if (!subscription) return false
    return true

}