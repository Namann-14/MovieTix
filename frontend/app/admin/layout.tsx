"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { RoleBasedRedirect } from "@/components/role-based-redirect"
import { AuthService } from "@/lib/auth"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is trying to access admin login page
    if (pathname === "/admin/login") {
      return // Allow access to login page
    }

    // For all other admin pages, check authentication
    const token = AuthService.getToken()
    if (!token) {
      router.push("/admin/login")
      return
    }

    // Check if user has admin role
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role !== "ROLE_ADMIN") {
        router.push("/admin/login")
        return
      }
    }
  }, [pathname, router])

  // If this is the login page, don't wrap with admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // For other admin pages, use the admin layout with role protection
  return (
    <RoleBasedRedirect allowedRoles={["ROLE_ADMIN"]}>
      <AdminLayout>{children}</AdminLayout>
    </RoleBasedRedirect>
  )
}