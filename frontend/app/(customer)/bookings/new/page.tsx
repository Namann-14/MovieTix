"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useCreateBooking } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ApiClient } from "@/lib/api"
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Users, Ticket } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"
import type { Showtime } from "@/lib/types"

export default function NewBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showtimeId = searchParams.get("showtimeId")
  const { toast } = useToast()

  const [numberOfSeats, setNumberOfSeats] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createBookingMutation = useCreateBooking()

  // Fetch showtime details
  const {
    data: showtime,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["showtime", showtimeId],
    queryFn: () => ApiClient.get<Showtime>(`/api/showtimes/${showtimeId}`),
    enabled: !!showtimeId,
  })

  useEffect(() => {
    if (!showtimeId) {
      router.push("/browse")
    }
  }, [showtimeId, router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showtimeId || !showtime) return

    if (numberOfSeats > showtime.availableSeats) {
      toast({
        title: "Not enough seats",
        description: `Only ${showtime.availableSeats} seats are available.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createBookingMutation.mutateAsync({
        showtimeId: parseInt(showtimeId),
        numberOfSeats,
      })

      toast({
        title: "Booking confirmed!",
        description: "Your movie tickets have been successfully booked.",
      })

      router.push("/bookings/my")
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showtimeId) {
    return null
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isServiceUnavailable = errorMessage.includes('503') || errorMessage.includes('Service Unavailable')
    
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              {isServiceUnavailable ? 'Service Temporarily Unavailable' : 'Showtime Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isServiceUnavailable 
                ? 'The booking service is currently unavailable. Please try again in a few moments.' 
                : 'The selected showtime could not be found.'}
            </p>
            <div className="space-y-2">
              {isServiceUnavailable && (
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mr-2"
                >
                  Try Again
                </Button>
              )}
              <Link href="/browse">
                <Button>Back to Movies</Button>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!showtime) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Showtime Not Found</h1>
            <Link href="/browse">
              <Button>Back to Movies</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const dateTime = formatDateTime(showtime.showDateTime)
  const totalPrice = numberOfSeats * showtime.ticketPrice

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href={`/movies/${showtime.movieId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Movie
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Movie & Showtime Info */}
          <div className="space-y-6">
            {/* Movie Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{showtime.movieTitle || "Movie Title"}</h3>
                  <p className="text-muted-foreground">Movie</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Date:</span>
                    <span>{dateTime.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Time:</span>
                    <span>{dateTime.time}</span>
                  </div>
                  {showtime.theaterName && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Theater:</span>
                      <span>{showtime.theaterName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Price per ticket:</span>
                    <span>${showtime.ticketPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available seats:</span>
                  <Badge variant="outline">{showtime.availableSeats} remaining</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Seat Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Select Seats
                </CardTitle>
                <CardDescription>Choose the number of seats you want to book</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seats">Number of Seats</Label>
                    <Input
                      id="seats"
                      type="number"
                      min="1"
                      max={Math.min(showtime.availableSeats, 10)}
                      value={numberOfSeats}
                      onChange={(e) => setNumberOfSeats(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum {Math.min(showtime.availableSeats, 10)} seats per booking
                    </p>
                  </div>

                  {/* Seat Visualization */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="inline-block bg-muted px-4 py-1 rounded text-sm font-medium">SCREEN</div>
                    </div>
                    <div className="grid grid-cols-8 gap-1 max-w-xs mx-auto">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded text-xs flex items-center justify-center ${
                            i < numberOfSeats
                              ? "bg-primary text-primary-foreground"
                              : i < showtime.availableSeats
                                ? "bg-background border border-border"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i < numberOfSeats ? "✓" : i < showtime.availableSeats ? "" : "✗"}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-background border border-border rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-muted rounded"></div>
                        <span>Occupied</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary & Checkout */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Movie:</span>
                      <span className="font-medium">{showtime.movieTitle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Date & Time:</span>
                      <span className="font-medium">
                        {dateTime.date.split(",")[0]} {dateTime.time}
                      </span>
                    </div>
                    {showtime.theaterName && (
                      <div className="flex justify-between text-sm">
                        <span>Theater:</span>
                        <span className="font-medium">{showtime.theaterName}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Seats:</span>
                      <span className="font-medium">{numberOfSeats}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price per ticket:</span>
                      <span className="font-medium">${showtime.ticketPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || numberOfSeats > showtime.availableSeats}
                  >
                    {isSubmitting ? "Processing..." : `Book ${numberOfSeats} Ticket${numberOfSeats > 1 ? "s" : ""}`}
                  </Button>

                  {numberOfSeats > showtime.availableSeats && (
                    <p className="text-sm text-destructive text-center">
                      Not enough seats available. Please reduce the number of seats.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
