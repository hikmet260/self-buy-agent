"use client"

import { useRouter } from "next/navigation"
import { FaydaVerification } from "@/components/auth/fayda-verification"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function FaydaVerificationPage() {
  const router = useRouter()

  const handleVerificationComplete = (data: {
    faydaId: string
    fullName: string
    dateOfBirth: string
    gender: string
    address: string
    photo: string
  } | null) => {
    if (data) {
      // Store verified data and redirect to continue registration
      // In a real app, you would store this in context/state
      router.push("/register?verified=true")
    }
  }

  return (
    <AuthLayout
      title="Verify Your Identity"
      subtitle="Use your Fayda National ID to verify your identity"
    >
      <FaydaVerification
        onVerificationComplete={handleVerificationComplete}
      />
    </AuthLayout>
  )
}
