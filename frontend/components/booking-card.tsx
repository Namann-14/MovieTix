import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react"
import type { Booking } from "@/lib/types"

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const showDateTime = booking.showtime?.showDateTime ? formatDateTime(booking.showtime.showDateTime) : null

  const bookingDate = formatDateTime(booking.bookingTime)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{booking.showtime?.movieTitle || "Movie Title"}</CardTitle>
            <CardDescription>Booking #{booking.id.toString().slice(-8).toUpperCase()}</CardDescription>
          </div>
          <Badge variant="default" className="shrink-0">
            CONFIRMED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showDateTime && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{showDateTime.date}</span>
            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
            <span>{showDateTime.time}</span>
          </div>
        )}

        {booking.showtime?.theaterName && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.showtime.theaterName}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <DollarSign className="h-4 w-4 text-primary" />
            <span>${booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Booked on {bookingDate.date} at {bookingDate.time}
        </div>
      </CardContent>
    </Card>
  )
}
