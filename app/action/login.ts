"use server"
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function validateLogin(email: string, password: string) {
   const user = await prisma.user.findUnique({
      where: { email }
   })

   if (!user) {
      return { error: "USER_NOT_FOUND" }
   }

   if (!user.emailVerified) {
      return { error: "EMAIL_NOT_VERIFIED" }
   }

   const passwordCheck = bcrypt.compare(
                            password,
                            user.password
                        )
    if (!passwordCheck) {
      return { error: "USER_NOT_FOUND" }
   }

   return { success: true }
}