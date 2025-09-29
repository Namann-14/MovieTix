"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { AuthService } from "@/lib/auth"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
  isAdmin: boolean
  isCustomer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Auth initialization error:", error)
        // Clear any invalid tokens
        AuthService.removeToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password })
    setUser(response.user)
    return response.user
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await AuthService.register({ name, email, password })
    setUser(response.user)
    return response.user
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const isAdmin = user?.role === "ROLE_ADMIN"
  const isCustomer = user?.role === "ROLE_CUSTOMER"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isCustomer,
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
