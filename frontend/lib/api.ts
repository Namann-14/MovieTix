import { AuthService } from "./auth"
import type { Movie, Theater, Showtime, Booking, DashboardStats } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeaders(),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        AuthService.removeToken()
        window.location.href = "/login"
        return Promise.reject(new Error("Unauthorized"))
      }

      if (response.status === 503) {
        throw new Error("Service temporarily unavailable. Please try again in a few moments.")
      }

      const error = await response.text()
      throw new Error(error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  static get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  static post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // Customer endpoints
  static getMovies(): Promise<Movie[]> {
    return this.get<Movie[]>("/api/movies")
  }

  static getMovie(id: number): Promise<Movie> {
    return this.get<Movie>(`/api/movies/${id}`)
  }

  static searchMovies(title: string): Promise<Movie[]> {
    return this.get<Movie[]>(`/api/movies/search?title=${encodeURIComponent(title)}`)
  }

  static getMovieShowtimes(movieId: number): Promise<Showtime[]> {
    return this.get<Showtime[]>(`/api/showtimes/movie/${movieId}`)
  }

  static createBooking(bookingData: { showtimeId: number; numberOfSeats: number }): Promise<Booking> {
    return this.post<Booking>("/api/bookings", bookingData)
  }

  static getMyBookings(): Promise<Booking[]> {
    return this.get<Booking[]>("/api/bookings/my-bookings").catch((error) => {
      // Fallback to different endpoint formats if the first one fails
      console.warn("Primary bookings endpoint failed, trying alternatives:", error.message)
      
      // Try multiple fallback endpoints
      const fallbackEndpoints = [
        "/api/user/bookings",
        "/api/bookings",
        "/api/customer/bookings",
        "/api/booking/user-bookings"
      ]
      
      const tryFallbacks = async (endpoints: string[]): Promise<Booking[]> => {
        if (endpoints.length === 0) {
          // If all endpoints fail, return empty array with a warning
          console.warn("All booking endpoints failed, returning empty array")
          return []
        }
        
        try {
          return await this.get<Booking[]>(endpoints[0])
        } catch (fallbackError) {
          console.warn(`Fallback endpoint ${endpoints[0]} failed:`, fallbackError instanceof Error ? fallbackError.message : String(fallbackError))
          return tryFallbacks(endpoints.slice(1))
        }
      }
      
      return tryFallbacks(fallbackEndpoints)
    })
  }

  // User profile
  static getUserProfile(): Promise<{ id: number; name: string; email: string; role: string }> {
    return this.get<{ id: number; name: string; email: string; role: string }>("/api/user/profile").catch((error) => {
      // Try alternative endpoints for user profile
      console.warn("Primary user profile endpoint failed, trying alternatives:", error.message)
      if (error.message?.includes('403') || error.message?.includes('404')) {
        return this.get<{ id: number; name: string; email: string; role: string }>("/api/users/profile").catch(() => {
          return this.get<{ id: number; name: string; email: string; role: string }>("/api/auth/profile")
        })
      }
      throw error
    })
  }

  // Admin endpoints - Movies
  static getAdminMovies(): Promise<Movie[]> {
    return this.get<Movie[]>("/api/admin/movies")
  }

  static getAdminMovie(id: number): Promise<Movie> {
    return this.get<Movie>(`/api/admin/movies/${id}`)
  }

  static createMovie(movieData: Omit<Movie, "id">): Promise<Movie> {
    return this.post<Movie>("/api/admin/movies", movieData)
  }

  static updateMovie(id: number, movieData: Omit<Movie, "id">): Promise<Movie> {
    return this.put<Movie>(`/api/admin/movies/${id}`, movieData)
  }

  static deleteMovie(id: number): Promise<void> {
    return this.delete<void>(`/api/admin/movies/${id}`)
  }

  // Admin endpoints - Theaters
  static getAdminTheaters(): Promise<Theater[]> {
    return this.get<Theater[]>("/api/admin/theaters")
  }

  static createTheater(theaterData: Omit<Theater, "id">): Promise<Theater> {
    return this.post<Theater>("/api/admin/theaters", theaterData)
  }

  static updateTheater(id: number, theaterData: Omit<Theater, "id">): Promise<Theater> {
    return this.put<Theater>(`/api/admin/theaters/${id}`, theaterData)
  }

  static deleteTheater(id: number): Promise<void> {
    return this.delete<void>(`/api/admin/theaters/${id}`)
  }

  // Admin endpoints - Showtimes
  static getAdminShowtimes(): Promise<Showtime[]> {
    return this.get<Showtime[]>("/api/admin/showtimes").catch((error) => {
      console.warn("Showtime admin service unavailable:", error.message)
      // Return empty array when service is unavailable
      return []
    })
  }

  static createShowtime(showtimeData: Omit<Showtime, "id" | "movie" | "theater">): Promise<Showtime> {
    return this.post<Showtime>("/api/admin/showtimes", showtimeData).catch((error) => {
      console.warn("Showtime creation service unavailable:", error.message)
      throw new Error("Showtime service is currently unavailable. Please try again later.")
    })
  }

  static updateShowtime(id: number, showtimeData: Omit<Showtime, "id" | "movie" | "theater">): Promise<Showtime> {
    return this.put<Showtime>(`/api/admin/showtimes/${id}`, showtimeData)
  }

  static deleteShowtime(id: number): Promise<void> {
    return this.delete<void>(`/api/admin/showtimes/${id}`).catch((error) => {
      console.warn("Showtime deletion service unavailable:", error.message)
      throw new Error("Unable to delete showtime. Service is currently unavailable.")
    })
  }

  // Admin endpoints - Bookings
  static getAdminBookings(): Promise<Booking[]> {
    return this.get<Booking[]>("/api/admin/bookings")
  }

  static getAdminBookingsByUser(userId: number): Promise<Booking[]> {
    return this.get<Booking[]>(`/api/admin/bookings/user/${userId}`)
  }

  static searchAdminBookings(query: string): Promise<Booking[]> {
    return this.get<Booking[]>(`/api/admin/bookings/search?q=${encodeURIComponent(query)}`)
  }

  static updateBookingStatus(id: number, status: string): Promise<void> {
    return this.put<void>(`/api/admin/bookings/${id}/status`, { status })
  }

  static deleteBooking(id: number): Promise<void> {
    return this.delete<void>(`/api/admin/bookings/${id}`)
  }

  // Admin endpoints - Users
  static makeUserAdmin(userId: number): Promise<void> {
    return this.post<void>(`/api/admin/users/${userId}/make-admin`)
  }

  // Admin dashboard
  static getDashboardStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>("/api/admin/dashboard/stats")
  }
}
