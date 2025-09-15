"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateMovie } from "@/lib/hooks"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Film } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
]

const RATINGS = ["G", "PG", "PG-13", "R", "NC-17"]

export default function NewMoviePage() {
  const router = useRouter()
  const createMovieMutation = useCreateMovie()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    rating: "",
    releaseDate: "",
    posterUrl: "",
    trailerUrl: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.description ||
      !formData.genre ||
      !formData.duration ||
      !formData.rating ||
      !formData.releaseDate
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      await createMovieMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        duration: Number.parseInt(formData.duration),
        rating: formData.rating,
        releaseDate: formData.releaseDate,
        posterUrl: formData.posterUrl || undefined,
        trailerUrl: formData.trailerUrl || undefined,
      })

      toast({
        title: "Movie created",
        description: `"${formData.title}" has been successfully added to the catalog.`,
      })

      router.push("/admin/movies")
    } catch (error) {
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create movie.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link
          href="/admin/movies"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Movies
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Movie</h1>
          <p className="text-muted-foreground">Create a new movie listing for your catalog</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              Movie Details
            </CardTitle>
            <CardDescription>Enter the movie information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="title">
                    Movie Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter movie title"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter movie description"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="genre">
                    Genre <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rating">
                    Rating <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {RATINGS.map((rating) => (
                        <SelectItem key={rating} value={rating}>
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">
                    Duration (minutes) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="120"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="releaseDate">
                    Release Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="posterUrl">Poster URL (optional)</Label>
                  <Input
                    id="posterUrl"
                    type="url"
                    value={formData.posterUrl}
                    onChange={(e) => handleInputChange("posterUrl", e.target.value)}
                    placeholder="https://example.com/poster.jpg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="trailerUrl">Trailer URL (optional)</Label>
                  <Input
                    id="trailerUrl"
                    type="url"
                    value={formData.trailerUrl}
                    onChange={(e) => handleInputChange("trailerUrl", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={createMovieMutation.isPending} className="flex-1">
                  {createMovieMutation.isPending ? "Creating..." : "Create Movie"}
                </Button>
                <Link href="/admin/movies">
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
