"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function OTPVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isLogin = searchParams.get("type") === "login"
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState("")
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    
    if (pastedData.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextEmptyIndex]?.focus()
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsResending(false)
    setCountdown(60)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const handleVerify = async () => {
    const otpValue = otp.join("")
    
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    // Simulate verification API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // For demo, any OTP works except 000000
    if (otpValue === "000000") {
      setError("Invalid verification code. Please try again.")
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    router.push("/dashboard")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Identity</CardTitle>
          <CardDescription className="text-base">
            We&apos;ve sent a 6-digit verification code to your registered phone number
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={cn(
                    "w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold",
                    error && "border-destructive",
                    digit && "border-primary bg-primary/5"
                  )}
                />
              ))}
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-sm text-muted-foreground">
                Resend code in{" "}
                <span className="font-semibold text-foreground">
                  {formatTime(countdown)}
                </span>
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary hover:text-primary/80"
              >
                {isResending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Resend Code
              </Button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Verify & Continue
          </Button>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href={isLogin ? "/login" : "/register"}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {isLogin ? "Sign In" : "Registration"}
            </Link>
          </div>

          {/* Info Box */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground text-center">
              Didn&apos;t receive the code? Check your spam folder or make sure you entered
              the correct phone number during registration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
