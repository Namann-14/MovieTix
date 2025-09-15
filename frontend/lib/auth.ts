import type { User, AuthResponse, LoginCredentials, RegisterData } from "./types"

const API_BASE_URL = "http://localhost:8080"

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
      // Since the backend doesn't have a /me endpoint, we'll decode the JWT
      // or create a default user. For now, we'll return a default user.
      // In a real implementation, you might want to add a /me endpoint to your backend
      // or decode the JWT token to get user information
      
      // For now, return a default user structure
      // You should implement proper JWT decoding or add a /me endpoint to your backend
      return {
        id: 1, // This should be decoded from JWT
        name: "User", // This should be decoded from JWT
        email: "user@example.com", // This should be decoded from JWT
        role: "ROLE_CUSTOMER" // This should be decoded from JWT
      }
    } catch (error) {
      this.removeToken()
      return null
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}
