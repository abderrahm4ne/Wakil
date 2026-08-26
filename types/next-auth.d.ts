import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: string
      isActive: boolean 
    } & DefaultSession['user']
  }

  interface User {
    plan?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan: string
    isActive: boolean
  }
}