"use client"

import { usePathname } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // If this is the admin login page, don't wrap with admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // For other admin pages, use the admin layout
  // Authentication is handled by AuthMiddleware at the root level
  return (
    <AdminLayout>{children}</AdminLayout>
  )
}