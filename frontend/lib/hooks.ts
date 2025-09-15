"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiClient } from "./api"
import type { Movie, Showtime, Booking, Theater } from "./types"

// Movie hooks
export function useMovies() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () => ApiClient.getMovies(),
  })
}

export function useMovie(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => ApiClient.getMovie(id),
    enabled: !!id,
  })
}

export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ["movies", "search", query],
    queryFn: () => ApiClient.searchMovies(query),
    enabled: !!query.trim(),
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
    queryFn: () => ApiClient.getMyBookings(),
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
    queryFn: () => ApiClient.getAdminShowtimes(),
  })
}

export function useCreateShowtime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (showtimeData: Omit<Showtime, "id" | "movie" | "theater">) =>
      ApiClient.createShowtime(showtimeData),
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
    mutationFn: (id: number) => ApiClient.deleteShowtime(id),
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
