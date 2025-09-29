"use client"

import { useQuery } from "@tanstack/react-query"
import { ApiClient } from "@/lib/api"
import type { Movie } from "@/lib/types"

// Custom hook that tries multiple ways to get a movie
export function useMovieWithFallback(id: number) {
  return useQuery({
    queryKey: ["movie-with-fallback", id],
    queryFn: async () => {
      console.log(`Trying to fetch movie ${id}...`)
      
      try {
        // First, try the direct movie endpoint
        console.log('Attempting direct fetch...')
        const movie = await ApiClient.getMovie(id)
        console.log('Direct fetch successful:', movie)
        return movie
      } catch (directError) {
        console.warn('Direct fetch failed:', directError)
        
        try {
          // Fallback: Get all movies and find the one with matching ID
          console.log('Trying fallback: fetch all movies...')
          const allMovies = await ApiClient.getMovies()
          console.log(`Got ${allMovies.length} movies, searching for ID ${id}`)
          
          const movie = allMovies.find((m: Movie) => m.id === id)
          if (movie) {
            console.log('Found movie via fallback:', movie)
            return movie
          } else {
            console.log('Movie not found in fallback list')
            throw new Error(`Movie with ID ${id} not found`)
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          
          // Check if it's a service unavailable error
          const errorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          if (errorMessage.includes('503') || errorMessage.includes('Service Unavailable')) {
            throw new Error('Movie service is temporarily unavailable. Please try again in a few moments.')
          }
          
          throw fallbackError
        }
      }
    },
    enabled: !!id && id > 0,
    retry: false, // Don't retry since we have our own fallback logic
  })
}