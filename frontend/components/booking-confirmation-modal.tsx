"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Clock, MapPin, Users, DollarSign, Download } from "lucide-react"
import type { Booking } from "@/lib/types"

interface BookingConfirmationModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

export function BookingConfirmationModal({ booking, isOpen, onClose }: BookingConfirmationModalProps) {
  if (!booking) return null

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const showDateTime = booking.showtime?.showDateTime ? formatDateTime(booking.showtime.showDateTime) : null

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    const ticketData = {
      bookingId: booking.id,
      movie: booking.showtime?.movie?.title,
      theater: booking.showtime?.theater?.name,
      date: showDateTime?.date,
      time: showDateTime?.time,
      seats: booking.numberOfSeats,
      total: booking.totalPrice,
    }

    const dataStr = JSON.stringify(ticketData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ticket-${booking.id.slice(-8)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl">Booking Confirmed!</DialogTitle>
          <DialogDescription>Your movie tickets have been successfully booked.</DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">{booking.showtime?.movie?.title}</h3>
              <Badge variant="outline" className="mt-1">
                Booking #{booking.id.slice(-8).toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              {showDateTime && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{showDateTime.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{showDateTime.time}</span>
                  </div>
                </>
              )}

              {booking.showtime?.theater && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.showtime.theater.name}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center gap-2 font-semibold">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>${booking.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button onClick={handleDownloadTicket} variant="outline" className="w-full bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          A confirmation email has been sent to your registered email address.
        </p>
      </DialogContent>
    </Dialog>
  )
}
