"use client"

import type React from "react"

import { useState } from "react"
import { useSearchMovies } from "@/lib/hooks"
import { MovieCard } from "@/components/movie-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { data: movies, isLoading } = useSearchMovies(searchTerm)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(query.trim())
  }

  const clearSearch = () => {
    setQuery("")
    setSearchTerm("")
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Movies</h1>
          <p className="text-muted-foreground">Find your favorite movies by title</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter movie title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" disabled={!query.trim()}>
              Search
            </Button>
          </div>
        </form>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Search results for "{searchTerm}"</h2>
          </div>
        )}

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

        {/* Results */}
        {movies && searchTerm && (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">No movies found</h2>
                <p className="text-muted-foreground">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold mb-2">Start Your Search</h2>
            <p className="text-muted-foreground">Enter a movie title above to find what you're looking for</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
