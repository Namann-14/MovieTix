"use client"

import { useMovie, useMovieShowtimes } from "@/lib/hooks"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, DollarSign, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function MovieDetailPage() {
  const params = useParams()
  const movieId = params.id as string

  const { data: movie, isLoading: movieLoading } = useMovie(movieId)
  const { data: showtimes, isLoading: showtimesLoading } = useMovieShowtimes(movieId)

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatShowtime = (dateString: string) => {
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

  const groupedShowtimes = showtimes?.reduce(
    (acc, showtime) => {
      const date = new Date(showtime.showDateTime).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(showtime)
      return acc
    },
    {} as Record<string, typeof showtimes>,
  )

  if (movieLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="aspect-[2/3] bg-muted rounded-lg"></div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!movie) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <Link href="/home">
              <Button>Back to Movies</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Movies
        </Link>

        {/* Movie Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="aspect-[2/3] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-8xl text-primary/30">🎬</div>
            )}
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-balance">{movie.title}</h1>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {movie.rating}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground text-pretty">{movie.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Duration:</span>
                <span>{formatDuration(movie.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Release Date:</span>
                <span>{formatDate(movie.releaseDate)}</span>
              </div>
            </div>

            <div>
              <span className="font-medium">Genre: </span>
              <Badge variant="outline">{movie.genre}</Badge>
            </div>

            {movie.trailerUrl && (
              <div>
                <Button variant="outline" asChild>
                  <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                    Watch Trailer
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Showtimes */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Showtimes & Tickets</h2>

          {showtimesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-32 mb-3"></div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-24 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : !showtimes || showtimes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-lg font-semibold mb-2">No Showtimes Available</h3>
                <p className="text-muted-foreground">
                  Showtimes for this movie haven't been scheduled yet. Check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedShowtimes || {}).map(([date, dateShowtimes]) => (
                <div key={date}>
                  <h3 className="text-lg font-semibold mb-3">{formatDate(dateShowtimes[0].showDateTime)}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateShowtimes.map((showtime) => {
                      const formatted = formatShowtime(showtime.showDateTime)
                      return (
                        <Card key={showtime.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{formatted.time}</CardTitle>
                              <Badge variant="outline">{showtime.availableSeats} seats left</Badge>
                            </div>
                            {showtime.theater && (
                              <CardDescription className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {showtime.theater.name}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-lg font-semibold">
                                <DollarSign className="h-4 w-4" />
                                {showtime.ticketPrice.toFixed(2)}
                              </div>
                              <Link href={`/bookings/new?showtimeId=${showtime.id}`}>
                                <Button size="sm" disabled={showtime.availableSeats === 0}>
                                  {showtime.availableSeats === 0 ? "Sold Out" : "Book Now"}
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
