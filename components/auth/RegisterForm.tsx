"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { EyeOff, Eye } from 'lucide-react';
import { useState } from "react";

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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const passType = showPassword ? 'text' : 'password'
    const ConfPassType = showConfirmPassword ? 'text' : 'password'


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

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={passType}
                placeholder="••••••••"
                value={password}
                onChange={(e) => update("password" ,e.target.value)}
                className="bg-transparent border-border"
              />
              {showPassword ? (
                <button type="button" onClick={() => setShowPassword(s => !s)}><EyeOff size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer"/></button>
              ) : (
                <button type="button" onClick={() => setShowPassword(s => !s)}><Eye size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer"/></button>
              )}
            </div>
            
            <div className="space-y-2 bg relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={ConfPassType}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => update("confirmPassword" ,e.target.value)}
                className="bg-transparent border-border"
              />
              {showConfirmPassword ? (
                <button type="button" onClick={() => setShowConfirmPassword(s => !s)}><EyeOff size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer"/></button>
              ) : (
                <button type="button" onClick={() => setShowConfirmPassword(s => !s)}><Eye size={19} className="absolute right-3 top-10 -translate-y-1/2 text-white/60 hover:text-white/40 transition-colors hover:cursor-pointer"/></button>
              )}
            </div>

          </form>
        </div>)
}