"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    if (email.trim() === "" || password.trim() === ""){
      setError("Fill required fields");
      setIsLoading(false)
      return
    }
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      console.log(res)
      setError("Invalid email or password")
      setIsLoading(false)
      return
    }
    router.push('/register')
    setIsLoading(false)
  }


  return (
    <form onSubmit={(e) => (handleSubmit(e))} className="space-y-6 sm:w-[45%]">
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
          className="bg-transparent border-border "
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
          className="bg-transparent border-border "
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

      <Button type="submit" className="w-full bg-primary text-black py-4.5" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      {error && (<p className="text-red-500 text-md text-center font-sans">
        {error}
        </p>)}

      <p className="text-center text-sm text-muted-foreground text-nowrap">
        {"Don't have an account? "}
        <a href="#" className="text-foreground hover:underline">
          Sign up
        </a>
      </p>
    </form>
  )
}
