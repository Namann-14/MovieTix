import { RoleBasedRedirect } from "@/components/role-based-redirect"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleBasedRedirect allowedRoles={["ROLE_CUSTOMER", "ROLE_ADMIN"]}>
      {children}
    </RoleBasedRedirect>
  )
}