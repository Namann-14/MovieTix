"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateShowtime, useAdminMovies, useAdminTheaters } from "@/lib/hooks"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NewShowtimePage() {
  const router = useRouter()
  const createShowtimeMutation = useCreateShowtime()
  const { data: movies } = useAdminMovies()
  const { data: theaters } = useAdminTheaters()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    showDateTime: "",
    ticketPrice: "",
    availableSeats: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.movieId || !formData.theaterId || !formData.showDateTime || !formData.ticketPrice) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(formData.ticketPrice)
    const availableSeats = formData.availableSeats ? Number.parseInt(formData.availableSeats) : undefined

    if (price <= 0) {
      toast({
        title: "Invalid price",
        description: "Price must be a positive number.",
        variant: "destructive",
      })
      return
    }

    if (availableSeats !== undefined && availableSeats <= 0) {
      toast({
        title: "Invalid seat count",
        description: "Available seats must be a positive number.",
        variant: "destructive",
      })
      return
    }

    try {
      await createShowtimeMutation.mutateAsync({
        movieId: formData.movieId,
        theaterId: formData.theaterId,
        showDateTime: formData.showDateTime,
        ticketPrice: price,
        availableSeats: availableSeats || 0,
      })

      toast({
        title: "Showtime created",
        description: "The showtime has been successfully scheduled.",
      })

      router.push("/admin/showtimes")
    } catch (error) {
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create showtime.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link
          href="/admin/showtimes"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Showtimes
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Schedule New Showtime</h1>
          <p className="text-muted-foreground">Create a new movie showtime</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Showtime Details
            </CardTitle>
            <CardDescription>Enter the showtime information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="movieId">
                    Movie <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.movieId} onValueChange={(value) => handleInputChange("movieId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select movie" />
                    </SelectTrigger>
                    <SelectContent>
                      {movies?.map((movie) => (
                        <SelectItem key={movie.id} value={movie.id}>
                          {movie.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theaterId">
                    Theater <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.theaterId} onValueChange={(value) => handleInputChange("theaterId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theater" />
                    </SelectTrigger>
                    <SelectContent>
                      {theaters?.map((theater) => (
                        <SelectItem key={theater.id} value={theater.id}>
                          {theater.name} - {theater.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="showDateTime">
                    Show Date & Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="showDateTime"
                    type="datetime-local"
                    value={formData.showDateTime}
                    onChange={(e) => handleInputChange("showDateTime", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ticketPrice">
                    Ticket Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.ticketPrice}
                    onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                    placeholder="15.99"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="availableSeats">Available Seats (optional)</Label>
                  <Input
                    id="availableSeats"
                    type="number"
                    min="0"
                    value={formData.availableSeats}
                    onChange={(e) => handleInputChange("availableSeats", e.target.value)}
                    placeholder="Leave empty to use theater capacity"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If not specified, will use the theater's full capacity
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={createShowtimeMutation.isPending} className="flex-1">
                  {createShowtimeMutation.isPending ? "Creating..." : "Create Showtime"}
                </Button>
                <Link href="/admin/showtimes">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
