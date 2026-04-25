"use client"

import { useState, useEffect, useCallback } from "react"
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Fingerprint,
  Camera,
  Shield,
  AlertCircle,
  RefreshCw,
  CreditCard,
  User,
  Calendar,
  MapPin,
  ArrowRight,
  Scan,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type VerificationStep = "input" | "biometric" | "processing" | "success" | "failed"
type BiometricMethod = "fingerprint" | "face" | null

interface FaydaUserData {
  faydaId: string
  fullName: string
  dateOfBirth: string
  gender: string
  address: string
  photo: string
}

interface FaydaVerificationProps {
  onVerificationComplete: (data: FaydaUserData | null) => void
  initialFaydaId?: string
}

export function FaydaVerification({
  onVerificationComplete,
  initialFaydaId = "",
}: FaydaVerificationProps) {
  const [faydaId, setFaydaId] = useState(initialFaydaId)
  const [step, setStep] = useState<VerificationStep>("input")
  const [biometricMethod, setBiometricMethod] = useState<BiometricMethod>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showBiometricDialog, setShowBiometricDialog] = useState(false)
  const [biometricProgress, setBiometricProgress] = useState(0)
  const [userData, setUserData] = useState<FaydaUserData | null>(null)
  const [attempts, setAttempts] = useState(0)

  const maxAttempts = 3

  // Simulated user data returned after successful verification
  const simulatedUserData: FaydaUserData = {
    faydaId: faydaId,
    fullName: "Abebe Kebede Tadesse",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: "Addis Ababa, Bole, Kebele 03",
    photo: "/placeholder-user.jpg",
  }

  const validateFaydaId = (id: string): boolean => {
    // Fayda ID should be 12 digits
    return /^\d{12}$/.test(id)
  }

  const handleFaydaIdChange = (value: string) => {
    // Only allow digits and limit to 12 characters
    const cleaned = value.replace(/\D/g, "").slice(0, 12)
    setFaydaId(cleaned)
    setError(null)
  }

  const formatFaydaId = (id: string): string => {
    // Format as XXXX-XXXX-XXXX
    const parts = []
    for (let i = 0; i < id.length; i += 4) {
      parts.push(id.slice(i, i + 4))
    }
    return parts.join("-")
  }

  const startVerification = () => {
    if (!validateFaydaId(faydaId)) {
      setError("Please enter a valid 12-digit Fayda ID")
      return
    }
    setStep("biometric")
    setError(null)
  }

  const selectBiometricMethod = (method: BiometricMethod) => {
    setBiometricMethod(method)
    setShowBiometricDialog(true)
    setBiometricProgress(0)
  }

  const simulateBiometricCapture = useCallback(() => {
    setBiometricProgress(0)
    const interval = setInterval(() => {
      setBiometricProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // After capture completes, start processing
    setTimeout(() => {
      setShowBiometricDialog(false)
      setStep("processing")
      simulateVerificationProcess()
    }, 2500)
  }, [])

  const simulateVerificationProcess = () => {
    setProgress(0)
    const steps = [
      { progress: 20, delay: 500 },
      { progress: 40, delay: 1000 },
      { progress: 60, delay: 1500 },
      { progress: 80, delay: 2000 },
      { progress: 100, delay: 2500 },
    ]

    steps.forEach(({ progress: p, delay }) => {
      setTimeout(() => setProgress(p), delay)
    })

    // Simulate success/failure (90% success rate for demo)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1
      if (isSuccess) {
        setUserData(simulatedUserData)
        setStep("success")
        onVerificationComplete(simulatedUserData)
      } else {
        setAttempts((prev) => prev + 1)
        if (attempts + 1 >= maxAttempts) {
          setError("Maximum verification attempts exceeded. Please try again later.")
          setStep("failed")
        } else {
          setError("Biometric verification failed. Please try again.")
          setStep("biometric")
        }
      }
    }, 3000)
  }

  const resetVerification = () => {
    setStep("input")
    setBiometricMethod(null)
    setProgress(0)
    setError(null)
    setUserData(null)
  }

  useEffect(() => {
    if (showBiometricDialog && biometricMethod) {
      const timer = setTimeout(() => {
        simulateBiometricCapture()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [showBiometricDialog, biometricMethod, simulateBiometricCapture])

  return (
    <div className="w-full space-y-6">
      {/* Fayda ID Input Step */}
      {step === "input" && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Fayda ID Verification</CardTitle>
            <CardDescription>
              Enter your Fayda National ID number to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="faydaId">Fayda ID Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="faydaId"
                  placeholder="XXXX-XXXX-XXXX"
                  className={cn(
                    "pl-11 text-lg tracking-wider font-mono h-12",
                    error && "border-destructive focus-visible:ring-destructive"
                  )}
                  value={formatFaydaId(faydaId)}
                  onChange={(e) => handleFaydaIdChange(e.target.value.replace(/-/g, ""))}
                  maxLength={14}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your 12-digit Fayda National ID number
              </p>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Secure Verification</p>
                  <p className="text-xs text-muted-foreground">
                    Your data is encrypted and securely transmitted to the Fayda
                    verification system. We do not store your biometric data.
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 text-base gap-2"
              onClick={startVerification}
              disabled={faydaId.length !== 12}
            >
              Continue to Verification
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Biometric Selection Step */}
      {step === "biometric" && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Biometric Verification</CardTitle>
            <CardDescription>
              Choose your preferred verification method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Fayda ID</p>
                  <p className="text-lg font-mono tracking-wider">
                    {formatFaydaId(faydaId)}
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
                <span className="text-muted-foreground ml-auto">
                  Attempts: {attempts}/{maxAttempts}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => selectBiometricMethod("fingerprint")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Fingerprint className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Fingerprint</p>
                  <p className="text-xs text-muted-foreground">
                    Scan your fingerprint
                  </p>
                </div>
              </button>

              <button
                onClick={() => selectBiometricMethod("face")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Face ID</p>
                  <p className="text-xs text-muted-foreground">
                    Use facial recognition
                  </p>
                </div>
              </button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={resetVerification}
            >
              Change Fayda ID
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Processing Step */}
      {step === "processing" && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Verifying Identity</CardTitle>
            <CardDescription>
              Please wait while we verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scan className="w-12 h-12 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Verification Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    progress >= 20 ? "bg-success" : "bg-muted"
                  )}
                >
                  {progress >= 20 ? (
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    progress >= 20 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Connecting to Fayda servers
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    progress >= 40 ? "bg-success" : "bg-muted"
                  )}
                >
                  {progress >= 40 ? (
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  ) : progress >= 20 ? (
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    progress >= 40 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Validating Fayda ID
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    progress >= 60 ? "bg-success" : "bg-muted"
                  )}
                >
                  {progress >= 60 ? (
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  ) : progress >= 40 ? (
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    progress >= 60 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Matching biometric data
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    progress >= 80 ? "bg-success" : "bg-muted"
                  )}
                >
                  {progress >= 80 ? (
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  ) : progress >= 60 ? (
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    progress >= 80 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Retrieving identity data
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    progress >= 100 ? "bg-success" : "bg-muted"
                  )}
                >
                  {progress >= 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  ) : progress >= 80 ? (
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    progress >= 100 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Finalizing verification
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Step */}
      {step === "success" && userData && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <CardTitle className="text-xl text-success">
              Identity Verified
            </CardTitle>
            <CardDescription>
              Your Fayda ID has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{userData.fullName}</p>
                  <Badge variant="secondary" className="mt-1">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 pt-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fayda ID</p>
                    <p className="font-mono tracking-wider">
                      {formatFaydaId(userData.faydaId)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p>{new Date(userData.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p>{userData.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p>{userData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success">
                  Verification Complete
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your identity has been verified with the Fayda National ID
                  system. This information will be used to create your account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed Step */}
      {step === "failed" && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">
              Verification Failed
            </CardTitle>
            <CardDescription>
              We couldn&apos;t verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Possible reasons:</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  Incorrect Fayda ID number
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  Biometric data does not match
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  Server connection issues
                </li>
              </ul>
            </div>

            <Button
              className="w-full gap-2"
              onClick={resetVerification}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Biometric Capture Dialog */}
      <Dialog open={showBiometricDialog} onOpenChange={setShowBiometricDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {biometricMethod === "fingerprint"
                ? "Fingerprint Scan"
                : "Face Recognition"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {biometricMethod === "fingerprint"
                ? "Place your finger on the scanner"
                : "Position your face within the frame"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-6">
            <div className="relative">
              <div
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center",
                  biometricMethod === "fingerprint"
                    ? "bg-primary/10"
                    : "bg-primary/10"
                )}
              >
                {biometricMethod === "fingerprint" ? (
                  <Fingerprint
                    className={cn(
                      "w-16 h-16 transition-colors",
                      biometricProgress > 0 ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                ) : (
                  <Camera
                    className={cn(
                      "w-16 h-16 transition-colors",
                      biometricProgress > 0 ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              {biometricProgress > 0 && (
                <svg
                  className="absolute inset-0 w-32 h-32 -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={289}
                    strokeDashoffset={289 - (289 * biometricProgress) / 100}
                    className="text-primary transition-all duration-100"
                  />
                </svg>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                {biometricProgress === 0
                  ? "Initializing..."
                  : biometricProgress < 100
                  ? "Capturing..."
                  : "Captured!"}
              </p>
              <p className="text-2xl font-bold text-primary">
                {biometricProgress}%
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
