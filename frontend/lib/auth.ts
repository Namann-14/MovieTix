import type { User, AuthResponse, LoginCredentials, RegisterData } from "./types"

export type { User, AuthResponse, LoginCredentials, RegisterData }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export class AuthService {
  private static TOKEN_KEY = "movie_ticket_jwt"

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static removeToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Login failed")
    }

    const data: { token: string } = await response.json()
    this.setToken(data.token)
    
    // Get user data after successful login
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error("Failed to get user data")
    }
    
    return { token: data.token, user }
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Registration failed")
    }

    const data: { token: string } = await response.json()
    this.setToken(data.token)
    
    // Get user data after successful registration
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error("Failed to get user data")
    }
    
    return { token: data.token, user }
  }

  static logout(): void {
    this.removeToken()
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      // Decode JWT token to get user info
      const payload = this.decodeJWT(token)
      if (!payload) {
        console.warn("Invalid JWT token")
        this.removeToken()
        return null
      }

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        console.warn("JWT token expired")
        this.removeToken()
        return null
      }

      // Try to get user profile from the backend API first
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/user?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const userData = await response.json()
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role
          }
        } else if (response.status === 401) {
          // Token is invalid, remove it
          console.warn("Token invalid, removing...")
          this.removeToken()
          return null
        } else {
          // Other errors (403, 404, 500, etc.) - fall back to JWT data but don't remove token
          console.warn(`API error ${response.status}, falling back to JWT data`)
        }
      } catch (networkError) {
        console.warn("Network error fetching user profile, falling back to JWT data:", networkError)
      }

      // Fallback to JWT token data if backend is not available
      const fallbackUser = {
        id: payload.sub ? parseInt(payload.sub) : payload.userId || 1,
        name: payload.name || payload.username || "User",
        email: payload.email || "user@example.com",
        role: payload.role || payload.authorities?.[0] || "ROLE_CUSTOMER"
      }
      return fallbackUser
    } catch (error) {
      console.error("Error getting current user:", error)
      this.removeToken()
      return null
    }
  }

  private static decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error decoding JWT:", error)
      return null
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}
