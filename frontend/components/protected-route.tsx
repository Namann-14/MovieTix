"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthLoading } from "./loading"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Shield, User } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setRedirecting(true)
        router.replace("/login")
        return
      }

      if (requireAdmin && user.role !== "ROLE_ADMIN") {
        setRedirecting(true)
        router.replace("/browse")
        return
      }
    }
  }, [user, loading, requireAdmin, router])

  if (loading || redirecting) {
    return <AuthLoading />
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.replace("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requireAdmin && user.role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Admin privileges required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.replace("/browse")} className="w-full">
              Browse Movies
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
