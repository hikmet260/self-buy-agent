import { Suspense } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { OTPVerification } from "@/components/auth/otp-verification"

export default function OTPVerificationPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <OTPVerification />
      </Suspense>
    </AuthLayout>
  )
}
