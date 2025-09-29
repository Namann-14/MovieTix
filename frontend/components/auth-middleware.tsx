"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthLoading } from "./loading"

interface AuthMiddlewareProps {
  children: React.ReactNode
}

export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/', '/admin/login']
  
  // Define admin-only routes
  const adminRoutes = ['/admin']
  
  // Define customer routes
  const customerRoutes = ['/browse', '/search', '/booking', '/profile']

  useEffect(() => {
    if (loading) return

    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || (route !== '/' && pathname.startsWith(route))
    )
    const isAdminRoute = adminRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    )
    const isCustomerRoute = customerRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    )

    // Handle authenticated users
    if (user) {
      // If user is on public routes (login/register/home), redirect to dashboard
      if (pathname === '/login' || pathname === '/register' || pathname === '/' || pathname === '/admin/login') {
        setIsRedirecting(true)
        if (user.role === "ROLE_ADMIN") {
          router.replace("/admin")
        } else if (user.role === "ROLE_CUSTOMER") {
          router.replace("/browse")
        }
        return
      }

      // Check role-based access for protected routes
      if (isAdminRoute && user.role !== "ROLE_ADMIN") {
        setIsRedirecting(true)
        router.replace("/browse")
        return
      }

      if (isCustomerRoute && user.role === "ROLE_ADMIN") {
        setIsRedirecting(true)
        router.replace("/admin")
        return
      }
    } else {
      // Handle unauthenticated users
      if (!isPublicRoute) {
        setIsRedirecting(true)
        router.replace("/login")
        return
      }
    }

    setIsRedirecting(false)
  }, [user, loading, pathname, router])

  if (loading || isRedirecting) {
    return <AuthLoading />
  }

  return <>{children}</>
}