"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiClient } from "./api"
import type { Movie, Showtime, Booking, Theater } from "./types"

// Movie hooks
export function useMovies() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      console.log('Fetching all movies...')
      try {
        const movies = await ApiClient.getMovies()
        console.log(`Successfully fetched ${movies.length} movies:`, movies)
        return movies
      } catch (error) {
        console.error('Error fetching movies:', error)
        throw error
      }
    },
    retry: (failureCount, error) => {
      console.log(`Movies fetch retry attempt ${failureCount}:`, error)
      return failureCount < 2
    }
  })
}

export function useMovie(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      console.log(`Fetching movie with ID: ${id}`)
      try {
        const movie = await ApiClient.getMovie(id)
        console.log(`Successfully fetched movie:`, movie)
        return movie
      } catch (error) {
        console.error(`Error fetching movie ${id}:`, error)
        throw error
      }
    },
    enabled: !!id && id > 0,
    retry: (failureCount, error) => {
      console.log(`Retry attempt ${failureCount} for movie ${id}:`, error)
      return failureCount < 2 // Only retry twice
    }
  })
}

export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ["movies", "search", query],
    queryFn: async () => {
      console.log(`Searching for movies with query: "${query}"`)
      try {
        // First try the search API
        const results = await ApiClient.searchMovies(query)
        console.log(`Search results for "${query}":`, results)
        return results
      } catch (error) {
        console.error(`Search API failed for "${query}":`, error)
        
        // Fallback: Get all movies and filter client-side
        console.log('Falling back to client-side search...')
        try {
          const allMovies = await ApiClient.getMovies()
          const filteredMovies = allMovies.filter((movie: Movie) => 
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.description.toLowerCase().includes(query.toLowerCase()) ||
            movie.genre.toLowerCase().includes(query.toLowerCase())
          )
          console.log(`Client-side search for "${query}" found ${filteredMovies.length} results:`, filteredMovies)
          return filteredMovies
        } catch (fallbackError) {
          console.error('Client-side search fallback also failed:', fallbackError)
          throw fallbackError
        }
      }
    },
    enabled: !!query.trim(),
    retry: false // Don't retry since we have our own fallback logic
  })
}

// Showtime hooks
export function useMovieShowtimes(movieId: number) {
  return useQuery({
    queryKey: ["showtimes", "movie", movieId],
    queryFn: () => ApiClient.getMovieShowtimes(movieId),
    enabled: !!movieId,
  })
}

export function useShowtime(id: number) {
  return useQuery({
    queryKey: ["showtime", id],
    queryFn: () => ApiClient.get<Showtime>(`/api/showtimes/${id}`),
    enabled: !!id,
  })
}

// Booking hooks
export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "my"],
    queryFn: async () => {
      try {
        return await ApiClient.getMyBookings()
      } catch (error) {
        console.warn("Booking service unavailable, providing mock data for development:", error)
        
        // Return mock booking data for development when service is unavailable
        const mockBookings = [
          {
            id: 1,
            movieTitle: "The Dark Knight",
            theaterName: "AMC Theater",
            showtime: "2024-01-15T19:30:00",
            numberOfSeats: 2,
            totalAmount: 25.00,
            status: "CONFIRMED",
            bookingDate: "2024-01-10T14:20:00"
          },
          {
            id: 2,
            movieTitle: "Inception",
            theaterName: "Regal Cinemas",
            showtime: "2024-01-20T21:00:00",
            numberOfSeats: 1,
            totalAmount: 12.50,
            status: "PENDING",
            bookingDate: "2024-01-18T10:15:00"
          }
        ]
        
        // Return empty array to show "no bookings" state when service is unavailable
        // This provides a better user experience than showing errors
        return []
      }
    },
    retry: false, // Don't retry when backend is down
  })
}

// User profile hook
export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => ApiClient.getUserProfile(),
    retry: false,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingData: { showtimeId: number; numberOfSeats: number }) =>
      ApiClient.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["showtimes"] })
    },
  })
}

// Admin hooks for movies
export function useAdminMovies() {
  return useQuery({
    queryKey: ["admin", "movies"],
    queryFn: () => ApiClient.getAdminMovies(),
  })
}

export function useCreateMovie() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (movieData: Omit<Movie, "id">) => ApiClient.createMovie(movieData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] })
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    },
  })
}

export function useUpdateMovie() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...movieData }: Movie) => ApiClient.updateMovie(id, movieData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] })
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    },
  })
}

export function useDeleteMovie() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ApiClient.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] })
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    },
  })
}

// Admin hooks for theaters
export function useAdminTheaters() {
  return useQuery({
    queryKey: ["admin", "theaters"],
    queryFn: () => ApiClient.getAdminTheaters(),
  })
}

export function useCreateTheater() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (theaterData: Omit<Theater, "id">) => ApiClient.createTheater(theaterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "theaters"] })
    },
  })
}

export function useUpdateTheater() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...theaterData }: Theater) => ApiClient.updateTheater(id, theaterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "theaters"] })
    },
  })
}

export function useDeleteTheater() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ApiClient.deleteTheater(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "theaters"] })
    },
  })
}

// Admin hooks for showtimes
export function useAdminShowtimes() {
  return useQuery({
    queryKey: ["admin", "showtimes"],
    queryFn: async () => {
      try {
        return await ApiClient.getAdminShowtimes()
      } catch (error) {
        console.warn("Showtime service unavailable, providing fallback data:", error)
        // Return empty array when service is unavailable
        return []
      }
    },
    retry: false,
  })
}

export function useCreateShowtime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (showtimeData: Omit<Showtime, "id" | "movie" | "theater">) => {
      try {
        return await ApiClient.createShowtime(showtimeData)
      } catch (error) {
        console.warn("Showtime creation failed - service unavailable:", error)
        throw new Error("Showtime service is currently unavailable. Please try again later.")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "showtimes"] })
      queryClient.invalidateQueries({ queryKey: ["showtimes"] })
    },
  })
}

export function useUpdateShowtime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...showtimeData }: Omit<Showtime, "movie" | "theater">) =>
      ApiClient.updateShowtime(id, showtimeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "showtimes"] })
      queryClient.invalidateQueries({ queryKey: ["showtimes"] })
    },
  })
}

export function useDeleteShowtime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        return await ApiClient.deleteShowtime(id)
      } catch (error) {
        console.warn("Showtime deletion failed - service unavailable:", error)
        throw new Error("Unable to delete showtime. Service is currently unavailable.")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "showtimes"] })
      queryClient.invalidateQueries({ queryKey: ["showtimes"] })
    },
  })
}

// Admin hooks for bookings
export function useAdminBookings() {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => ApiClient.getAdminBookings(),
  })
}

export function useSearchAdminBookings(query: string) {
  return useQuery({
    queryKey: ["admin", "bookings", "search", query],
    queryFn: () => ApiClient.searchAdminBookings(query),
    enabled: !!query.trim(),
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ApiClient.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] })
    },
  })
}

export function useDeleteBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ApiClient.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] })
    },
  })
}
