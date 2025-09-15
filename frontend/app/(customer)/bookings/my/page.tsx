"use client"

import { useMyBookings } from "@/lib/hooks"
import { BookingCard } from "@/components/booking-card"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MyBookingsPage() {
  const { data: bookings, isLoading, error } = useMyBookings()

  if (error) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Bookings</h1>
            <p className="text-muted-foreground">Unable to load your bookings. Please try again later.</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your movie ticket bookings</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings List */}
        {bookings && (
          <>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎫</div>
                <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any movie tickets yet. Start exploring movies!
                </p>
                <Link href="/home">
                  <Button>Browse Movies</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
