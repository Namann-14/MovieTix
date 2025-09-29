"use client"

import { useMyBookings } from "@/lib/hooks"
import { BookingCard } from "@/components/booking-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function MyBookingsPage() {
  const { data: bookings, isLoading, error } = useMyBookings()
  const { user } = useAuth()

  if (error) {
    console.error("Bookings error:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your movie ticket bookings</p>
          </div>
          
          <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">No Bookings Yet</h2>
            <p className="text-blue-700 mb-4">
              You haven't made any movie bookings yet. Start exploring our movies and book your favorite showtimes!
            </p>
            <div className="text-xs text-blue-600 mb-4 bg-blue-100 rounded px-3 py-1 inline-block">
              📝 Booking system is being set up
            </div>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh
              </Button>
              <Link href="/browse">
                <Button>Browse Movies</Button>
              </Link>
            </div>
          </div>

          {user && (
            <div className="mt-6 text-sm text-muted-foreground">
              Logged in as: {user.name || user.email}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
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
                <Link href="/browse">
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
  )
}
