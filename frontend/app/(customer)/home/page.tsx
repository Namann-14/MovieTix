"use client"

import { useMovies } from "@/lib/hooks"
import { MovieCard } from "@/components/movie-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function CustomerDashboard() {
  const { data: movies, isLoading, error } = useMovies()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMovies = movies?.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <div className="text-destructive mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-destructive mb-2">Service Unavailable</h1>
              <p className="text-sm text-muted-foreground mb-4">
                The movie service is currently unavailable. This may be temporary while backend services are starting up.
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Retry Loading Movies
                </button>
                <p className="text-xs text-muted-foreground">
                  If the problem persists, please contact support or try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Now Showing</h1>
        <p className="text-muted-foreground">Discover and book tickets for the latest movies</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies by title or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/search">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movies Grid */}
      {filteredMovies && (
        <>
          {filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-xl font-semibold mb-2">No movies found</h2>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms" : "No movies are currently available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
