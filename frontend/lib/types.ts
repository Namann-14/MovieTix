export interface Movie {
  id: number
  title: string
  description: string
  genre: string
  durationInMinutes: number
  releaseDate: string
  posterUrl?: string
  trailerUrl?: string
}

export interface Theater {
  id: number
  name: string
  location: string
  seatingCapacity: number
}

export interface Showtime {
  id: number
  movieId: number
  movieTitle: string
  theaterId: number
  theaterName: string
  showDateTime: string
  ticketPrice: number
  availableSeats: number
  // Optional nested objects for backward compatibility
  movie?: Movie
  theater?: Theater
}

export interface Booking {
  id: number
  userId: number
  showtimeId: number
  numberOfSeats: number
  totalPrice: number
  bookingTime: string
  showtime?: Showtime
}

// Extended booking interface for admin view with joined data
export interface AdminBooking {
  id: number
  userId: number
  showtimeId: number
  numberOfSeats: number
  totalPrice: number
  bookingTime: string
  showtime?: Showtime
  // These might come from joined data if the backend provides them
  customerName?: string
  customerEmail?: string
  movieTitle?: string
  theaterName?: string
}

// Auth types
export interface User {
  id: number
  name: string
  email: string
  role: "ROLE_CUSTOMER" | "ROLE_ADMIN"
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

// Admin dashboard stats
export interface DashboardStats {
  totalMovies: number
  totalBookings: number
  totalRevenue: number
  totalCustomers: number
  recentBookings: Array<{
    id: number
    movieTitle: string
    customerName: string
    totalPrice: number
    bookingDate: string
  }>
}
