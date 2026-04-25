"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
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
  { id: 2, name: "Identity", icon: CreditCard },
  { id: 3, name: "Bank Details", icon: Building2 },
  { id: 4, name: "Security", icon: Lock },
]

const ethiopianBanks = [
  "Commercial Bank of Ethiopia",
  "Awash Bank",
  "Dashen Bank",
  "Bank of Abyssinia",
  "United Bank",
  "Nib International Bank",
  "Cooperative Bank of Oromia",
  "Wegagen Bank",
  "Zemen Bank",
  "Bunna Bank",
  "Berhan Bank",
  "Abay Bank",
  "Oromia Bank",
  "Lion International Bank",
  "Enat Bank",
  "Debub Global Bank",
  "Hijra Bank",
  "Amhara Bank",
  "Ahadu Bank",
  "Siinqee Bank",
]

interface FormData {
  firstName: string
  fatherName: string
  grandfatherName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  city: string
  subCity: string
  kebele: string
  faydaId: string
  idDocument: File | null
  faydaVerified: boolean
  bankName: string
  accountHolderName: string
  accountNumber: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  [key: string]: string
}

interface FaydaUserData {
  faydaId: string
  fullName: string
  dateOfBirth: string
  gender: string
  address: string
  photo: string
}

export function RegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [faydaData, setFaydaData] = useState<FaydaUserData | null>(null)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    city: "",
    subCity: "",
    kebele: "",
    faydaId: "",
    idDocument: null,
    faydaVerified: false,
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    password: "",
    confirmPassword: "",
  })

  const updateFormData = (field: keyof FormData, value: string | File | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required"
        if (!formData.grandfatherName.trim()) newErrors.grandfatherName = "Grandfather's name is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.gender) newErrors.gender = "Gender is required"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        else if (!/^(\+251|0)?[-\s]?9\d{8}$/.test(formData.phone.replace(/[-\s]/g, "")))
          newErrors.phone = "Enter a valid Ethiopian number (e.g., +251912345678)"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          newErrors.email = "Invalid email address"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.subCity.trim()) newErrors.subCity = "Sub-city is required"
        if (!formData.kebele.trim()) newErrors.kebele = "Kebele is required"
        break
      case 2:
        if (!formData.faydaId.trim()) newErrors.faydaId = "Fayda ID is required"
        else if (!/^\d{12}$/.test(formData.faydaId))
          newErrors.faydaId = "Fayda ID must be 12 digits"
        break
      case 3:
        if (!formData.bankName) newErrors.bankName = "Bank name is required"
        if (!formData.accountHolderName.trim())
          newErrors.accountHolderName = "Account holder name is required"
        if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account number is required"
        else if (!/^\d{13,16}$/.test(formData.accountNumber))
          newErrors.accountNumber = "Account number must be 13-16 digits"
        break
      case 4:
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters"
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
          newErrors.password = "Password must contain uppercase, lowercase, and number"
        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
        else if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsLoading(true)
    // Simulate registration API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push("/otp-verification")
  }

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 15
    if (/[^a-zA-Z\d]/.test(password)) strength += 10

    if (strength <= 25) return { strength, label: "Weak", color: "bg-destructive" }
    if (strength <= 50) return { strength, label: "Fair", color: "bg-warning" }
    if (strength <= 75) return { strength, label: "Good", color: "bg-accent" }
    return { strength: Math.min(strength, 100), label: "Strong", color: "bg-success" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium hidden sm:block",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 sm:w-20 h-1 mx-2",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
        <Progress value={(currentStep / 4) * 100} className="h-2" />
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center">
            {currentStep === 1 && "Personal Information"}
            {currentStep === 2 && "Identity Verification"}
            {currentStep === 3 && "Bank Information"}
            {currentStep === 4 && "Create Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {currentStep === 1 && "Please provide your personal details"}
            {currentStep === 2 && "Verify your identity with Fayda ID"}
            {currentStep === 3 && "Link your bank account"}
            {currentStep === 4 && "Secure your account with a strong password"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="First name"
                      className={cn("pl-10", errors.firstName && "border-destructive")}
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father&apos;s Name</Label>
                  <Input
                    id="fatherName"
                    placeholder="Father's name"
                    className={cn(errors.fatherName && "border-destructive")}
                    value={formData.fatherName}
                    onChange={(e) => updateFormData("fatherName", e.target.value)}
                  />
                  {errors.fatherName && (
                    <p className="text-xs text-destructive">{errors.fatherName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grandfatherName">Grandfather&apos;s Name</Label>
                  <Input
                    id="grandfatherName"
                    placeholder="Grandfather's name"
                    className={cn(errors.grandfatherName && "border-destructive")}
                    value={formData.grandfatherName}
                    onChange={(e) => updateFormData("grandfatherName", e.target.value)}
                  />
                  {errors.grandfatherName && (
                    <p className="text-xs text-destructive">{errors.grandfatherName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className={cn("pl-10", errors.dateOfBirth && "border-destructive")}
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateFormData("gender", value)}
                  >
                    <SelectTrigger
                      className={cn(errors.gender && "border-destructive")}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-destructive">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+251912345678 or 0912345678"
                      className={cn("pl-10", errors.phone && "border-destructive")}
                      value={formData.phone}
                      onChange={(e) => {
                        // Allow only digits, +, -, and spaces
                        const value = e.target.value.replace(/[^\d+\-\s]/g, "")
                        updateFormData("phone", value)
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Address
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="City"
                      className={cn(errors.city && "border-destructive")}
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Sub-city"
                      className={cn(errors.subCity && "border-destructive")}
                      value={formData.subCity}
                      onChange={(e) => updateFormData("subCity", e.target.value)}
                    />
                    {errors.subCity && (
                      <p className="text-xs text-destructive mt-1">{errors.subCity}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Kebele"
                      className={cn(errors.kebele && "border-destructive")}
                      value={formData.kebele}
                      onChange={(e) => updateFormData("kebele", e.target.value)}
                    />
                    {errors.kebele && (
                      <p className="text-xs text-destructive mt-1">{errors.kebele}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Identity Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <FaydaVerification
                initialFaydaId={formData.faydaId}
                onVerificationComplete={(data) => {
                  if (data) {
                    setFaydaData(data)
                    updateFormData("faydaId", data.faydaId)
                    updateFormData("faydaVerified", true)
                    // Auto-fill personal info from Fayda data
                    const nameParts = data.fullName.split(" ")
                    if (nameParts.length >= 3) {
                      updateFormData("firstName", nameParts[0])
                      updateFormData("fatherName", nameParts[1])
                      updateFormData("grandfatherName", nameParts.slice(2).join(" "))
                    }
                    if (data.dateOfBirth) {
                      updateFormData("dateOfBirth", data.dateOfBirth)
                    }
                    if (data.gender) {
                      updateFormData("gender", data.gender.toLowerCase())
                    }
                    if (data.address) {
                      const addressParts = data.address.split(", ")
                      if (addressParts.length >= 3) {
                        updateFormData("city", addressParts[0])
                        updateFormData("subCity", addressParts[1])
                        updateFormData("kebele", addressParts[2])
                      }
                    }
                  }
                }}
              />
            </div>
          )}

          {/* Step 3: Bank Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Select
                  value={formData.bankName}
                  onValueChange={(value) => updateFormData("bankName", value)}
                >
                  <SelectTrigger
                    className={cn(errors.bankName && "border-destructive")}
                  >
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {ethiopianBanks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bankName && (
                  <p className="text-xs text-destructive">{errors.bankName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="accountHolderName"
                    placeholder="Name as it appears on your account"
                    className={cn("pl-10", errors.accountHolderName && "border-destructive")}
                    value={formData.accountHolderName}
                    onChange={(e) => updateFormData("accountHolderName", e.target.value)}
                  />
                </div>
                {errors.accountHolderName && (
                  <p className="text-xs text-destructive">{errors.accountHolderName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="accountNumber"
                    placeholder="Enter your account number"
                    className={cn("pl-10", errors.accountNumber && "border-destructive")}
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                      updateFormData("accountNumber", value)
                    }}
                    maxLength={16}
                  />
                </div>
                {errors.accountNumber && (
                  <p className="text-xs text-destructive">{errors.accountNumber}</p>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Your information is secure
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We use bank-level encryption to protect your financial information.
                    Your data is never shared without your consent.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Security */}
          {currentStep === 4 && (
            <div className="space-y-6">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Password strength</span>
                    <span
                      className={cn(
                        "font-medium",
                        passwordStrength.label === "Weak" && "text-destructive",
                        passwordStrength.label === "Fair" && "text-warning",
                        passwordStrength.label === "Good" && "text-accent",
                        passwordStrength.label === "Strong" && "text-success"
                      )}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-300", passwordStrength.color)}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={cn(
                      "pl-10 pr-10",
                      errors.confirmPassword && "border-destructive"
                    )}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Password Requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={cn(
                        "h-3 w-3",
                        formData.password.length >= 8 ? "text-success" : "text-muted-foreground"
                      )}
                    />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={cn(
                        "h-3 w-3",
                        /[A-Z]/.test(formData.password) ? "text-success" : "text-muted-foreground"
                      )}
                    />
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={cn(
                        "h-3 w-3",
                        /[a-z]/.test(formData.password) ? "text-success" : "text-muted-foreground"
                      )}
                    />
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={cn(
                        "h-3 w-3",
                        /\d/.test(formData.password) ? "text-success" : "text-muted-foreground"
                      )}
                    />
                    One number
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="gap-2 min-w-[120px]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
