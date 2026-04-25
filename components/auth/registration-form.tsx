"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { FaydaVerification } from "@/components/auth/fayda-verification"

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Fayda ID", icon: CreditCard },
  { id: 3, name: "Security", icon: Lock },
]

interface FormData {
  fullName: string
  phone: string
  email: string
  city: string
  subCity: string
  faydaId: string
  faydaVerified: boolean
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  phone?: string
  email?: string
  city?: string
  subCity?: string
  faydaId?: string
  password?: string
  confirmPassword?: string
}

interface FaydaUserData {
  faydaId: string
  fullName: string
  dateOfBirth: string
  gender: string
  address: string
  photo: string
}

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  subCity: "",
  faydaId: "",
  faydaVerified: false,
  password: "",
  confirmPassword: "",
}

export function RegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [faydaData, setFaydaData] = useState<FaydaUserData | null>(null)

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
      else if (!/^(\+251|0)?[-\s]?9\d{8}$/.test(formData.phone.replace(/[-\s]/g, "")))
        newErrors.phone = "Enter a valid Ethiopian number (e.g., +251912345678)"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email address"
      if (!formData.city) newErrors.city = "City is required"
    }

    if (step === 2) {
      if (!formData.faydaVerified) {
        newErrors.faydaId = "Please verify your Fayda ID to continue"
      }
    }

    if (step === 3) {
      if (!formData.password) newErrors.password = "Password is required"
      else if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters"
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
        newErrors.password = "Include uppercase, lowercase, and number"
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push("/search")
  }

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    if (strength <= 2) return { strength: (strength / 5) * 100, label: "Weak", color: "bg-destructive" }
    if (strength <= 3) return { strength: (strength / 5) * 100, label: "Medium", color: "bg-warning" }
    return { strength: (strength / 5) * 100, label: "Strong", color: "bg-success" }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const progress = (currentStep / steps.length) * 100

  return (
    <Card className="w-full max-w-lg mx-auto border-0 shadow-lg">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription>Join ShopAgent for smarter shopping</CardDescription>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="font-medium text-foreground">{steps[currentStep - 1].name}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between pt-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 sm:w-20 h-0.5 mx-1",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className={cn("pl-10", errors.fullName && "border-destructive")}
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+251912345678"
                      className={cn("pl-10", errors.phone && "border-destructive")}
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d+\-\s]/g, "")
                        updateFormData("phone", value)
                      }}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={cn("pl-10", errors.email && "border-destructive")}
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => updateFormData("city", value)}
                  >
                    <SelectTrigger id="city" className={cn(errors.city && "border-destructive")}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addis_ababa">Addis Ababa</SelectItem>
                      <SelectItem value="dire_dawa">Dire Dawa</SelectItem>
                      <SelectItem value="bahir_dar">Bahir Dar</SelectItem>
                      <SelectItem value="hawassa">Hawassa</SelectItem>
                      <SelectItem value="mekelle">Mekelle</SelectItem>
                      <SelectItem value="adama">Adama</SelectItem>
                      <SelectItem value="gondar">Gondar</SelectItem>
                      <SelectItem value="jimma">Jimma</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCity">Sub City / Zone</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="subCity"
                      placeholder="e.g., Bole"
                      className="pl-10"
                      value={formData.subCity}
                      onChange={(e) => updateFormData("subCity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Fayda Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <FaydaVerification
                initialFaydaId={formData.faydaId}
                onVerificationComplete={(data) => {
                  if (data) {
                    setFaydaData(data)
                    updateFormData("faydaId", data.faydaId)
                    updateFormData("faydaVerified", true)
                    // Auto-fill name from Fayda data if available
                    if (data.fullName && !formData.fullName) {
                      updateFormData("fullName", data.fullName)
                    }
                  }
                }}
              />
              {errors.faydaId && (
                <p className="text-xs text-destructive text-center">{errors.faydaId}</p>
              )}
            </div>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={cn("pl-10 pr-10", errors.password && "border-destructive")}
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength</span>
                      <span className={cn(
                        passwordStrength.label === "Weak" && "text-destructive",
                        passwordStrength.label === "Medium" && "text-warning",
                        passwordStrength.label === "Strong" && "text-success"
                      )}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <Progress value={passwordStrength.strength} className={cn("h-1", passwordStrength.color)} />
                  </div>
                )}
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={cn("pl-10 pr-10", errors.confirmPassword && "border-destructive")}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Account Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Account Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium truncate">{formData.fullName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{formData.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{formData.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fayda ID</p>
                    <p className="font-medium font-mono text-xs">
                      {formData.faydaId ? formData.faydaId.replace(/(\d{4})/g, "$1-").slice(0, -1) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 pt-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNext} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="gap-2 min-w-[140px]">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
