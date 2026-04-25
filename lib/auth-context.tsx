"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface User {
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
  faydaVerified: boolean
  bankName: string
  accountHolderName: string
  accountNumber: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
