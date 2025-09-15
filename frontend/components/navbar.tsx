"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Film, User, LogOut, Settings, Calendar, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout, isAdmin, isCustomer } = useAuth()

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CinemaHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isCustomer && (
                  <div className="hidden md:flex items-center space-x-4">
                    <Link href="/dashboard">
                      <Button variant="ghost">Movies</Button>
                    </Link>
                    <Link href="/search">
                      <Button variant="ghost">Search</Button>
                    </Link>
                    <Link href="/bookings/my">
                      <Button variant="ghost">My Bookings</Button>
                    </Link>
                  </div>
                )}

                {isAdmin && (
                  <div className="hidden md:flex items-center space-x-4">
                    <Link href="/admin/dashboard">
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                    <Link href="/admin/movies">
                      <Button variant="ghost">Movies</Button>
                    </Link>
                    <Link href="/admin/theaters">
                      <Button variant="ghost">Theaters</Button>
                    </Link>
                    <Link href="/admin/showtimes">
                      <Button variant="ghost">Showtimes</Button>
                    </Link>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                    <DropdownMenuSeparator />

                    {isCustomer && (
                      <>
                        <DropdownMenuItem asChild className="md:hidden">
                          <Link href="/dashboard" className="flex items-center">
                            <Film className="mr-2 h-4 w-4" />
                            Movies
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="md:hidden">
                          <Link href="/bookings/my" className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            My Bookings
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild className="md:hidden">
                          <Link href="/admin/dashboard" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="md:hidden">
                          <Link href="/admin/users" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Users
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
