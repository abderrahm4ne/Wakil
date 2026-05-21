"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterFormProps {
    data: {
        fullName: string
        email: string
        password: string
        confirmPassword: string
    }
    onChange: (data: RegisterFormProps["data"]) => void
}

export function RegisterForm({ data, onChange }: RegisterFormProps) {
    const update = (field: string, value: string) => {
        onChange({ ...data, [field]: value })
    }

    return (
      <>
      1
      </>
    )
}