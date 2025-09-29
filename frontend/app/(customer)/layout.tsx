import { ProtectedRoute } from "@/components/protected-route"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}