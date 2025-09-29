"use client"

// Quick test authentication for development
export async function quickTestLogin() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@movietix.com",
        password: "test123"
      }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem("movie_ticket_jwt", data.token)
      console.log("Quick login successful!")
      window.location.reload()
      return true
    }
  } catch (error) {
    console.error("Quick login failed:", error)
  }
  return false
}