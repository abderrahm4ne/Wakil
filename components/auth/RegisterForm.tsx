"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterFormProps {
    data: {
        name: string
        email: string
        password: string
        confirmPassword: string
    }
    onChange: (data: RegisterFormProps["data"]) => void
}

export function RegisterForm({ data, onChange }: RegisterFormProps) {
    const { name, email, password, confirmPassword } = data 
    const update = (field: string, value: string) => {
        onChange({ ...data, [field]: value })
    }

    return (
      <div
          className="w-full h-full flex flex-col justify-center items-center md:space-y-10 space-y-7 py-7"
        >
          <div className="flex flex-col items-start lg:w-[45%] w-[80%] space-y-2">
            <h1 className="font-bold md:text-3xl text-xl font-sans tracking-tight text-wrap">
              Get started
            </h1>
            <h3 className="font-semibold md:text-md text-xs text-muted-foreground tracking-tight text-wrap">
              Create your account and choose your plan
            </h3>
          </div>

          <form className="space-y-4 lg:w-[45%] w-[80%] font-sans">

            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => update("name" ,e.target.value)}
                className="bg-transparent border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => update("email" ,e.target.value)}
                className="bg-transparent border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => update("password" ,e.target.value)}
                className="bg-transparent border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => update("confirmPassword" ,e.target.value)}
                className="bg-transparent border-border"
              />
            </div>

          </form>
        </div>)
}