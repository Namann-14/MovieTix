"use client"

import { useState } from "react"
import { useAdminBookings } from "@/lib/hooks"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, Users, DollarSign } from "lucide-react"
import { toast } from "sonner"

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

  const { data: allBookings, isLoading: isLoadingAll } = useAdminBookings()
  // Disable search and status functionality for now since backend doesn't support it
  // const { data: searchResults, isLoading: isSearching } = useSearchAdminBookings(searchQuery)
  // const updateStatusMutation = useUpdateBookingStatus()
  // const deleteBookingMutation = useDeleteBooking()

  const bookings = allBookings // searchQuery.trim() ? searchResults : allBookings
  const isLoading = isLoadingAll // searchQuery.trim() ? isSearching : isLoadingAll

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    // Backend doesn't support status updates yet
    toast.error("Status updates not yet supported by backend")
  }

  const handleDeleteBooking = async (bookingId: string) => {
    // Backend doesn't support booking deletion yet
    toast.error("Booking deletion not yet supported by backend")
  }

  const getStatusBadgeVariant = (status: string) => {
    if (!status) return "outline"
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default"
      case "cancelled":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Booking Management</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBookings = bookings?.length || 0
  // Since backend doesn't have status, we'll show all bookings as active for now
  const confirmedBookings = bookings?.length || 0
  const cancelledBookings = 0
  const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Booking Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">Active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From all bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Search - Disabled for now since backend doesn't support search */}
      <Card style={{ display: 'none' }}>
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
          <CardDescription>Search by customer name, email, movie title, or booking ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage customer bookings and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings && bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Showtime ID</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Booking Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.showtimeId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {booking.numberOfSeats}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(booking.totalPrice)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(booking.bookingTime)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
