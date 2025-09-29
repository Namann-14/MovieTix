"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/lib/hooks"

interface RoleBasedRedirectProps {
  allowedRoles?: string[]
  redirectPath?: string
  children: React.ReactNode
}

export function RoleBasedRedirect({ 
  allowedRoles = [], 
  redirectPath,
  children 
}: RoleBasedRedirectProps) {
  const { data: user, isLoading, error } = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // If user is not authenticated, redirect to login
    if (error || !user) {
      router.replace('/login')
      return
    }

    // If specific roles are required and user doesn't have permission
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Redirect admin users to admin dashboard
      if (user.role === 'ROLE_ADMIN') {
        router.replace('/admin')
      } 
      // Redirect regular users to browse page
      else if (user.role === 'ROLE_CUSTOMER') {
        router.replace('/browse')
      }
      // Fallback redirect
      else if (redirectPath) {
        router.replace(redirectPath)
      }
      return
    }

    // Auto-redirect based on role if no specific route restrictions
    if (allowedRoles.length === 0) {
      if (user.role === 'ROLE_ADMIN') {
        router.replace('/admin')
      } else if (user.role === 'ROLE_CUSTOMER') {
        router.replace('/browse')
      }
    }
  }, [user, isLoading, error, allowedRoles, redirectPath, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show access denied if user doesn't have permission
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Show auth error
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Helper hook for role checking
export function useRole() {
  const { data: user, isLoading, error } = useUserProfile()
  
  return {
    user,
    isLoading,
    error,
    isAdmin: user?.role === 'ROLE_ADMIN',
    isCustomer: user?.role === 'ROLE_CUSTOMER',
    hasRole: (role: string) => user?.role === role
  }
}