"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)



  return (
    <form className="space-y-6 w-[45%]">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="transparent border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground ">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="transparent border-border"
        />
      </div>

      <div className="flex justify-end">
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-muted-foreground transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full bg-white text-black" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <a href="#" className="text-foreground hover:underline">
          Sign up
        </a>
      </p>
    </form>
  )
}
