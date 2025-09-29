"use client"

import { useState } from "react"
import { useAdminShowtimes, useDeleteShowtime } from "@/lib/hooks"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AdminShowtimesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: showtimes, isLoading } = useAdminShowtimes()
  const deleteShowtimeMutation = useDeleteShowtime()
  const { toast } = useToast()

  const filteredShowtimes = showtimes?.filter(
    (showtime) =>
      showtime.movie?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      showtime.theater?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const handleDeleteShowtime = async (showtimeId: number) => {
    try {
      await deleteShowtimeMutation.mutateAsync(showtimeId)
      toast({
        title: "Showtime deleted",
        description: "The showtime has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete showtime.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Showtime Management</h1>
            <p className="text-muted-foreground">Schedule and manage movie showtimes</p>
          </div>
          <Link href="/admin/showtimes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Showtime
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search showtimes by movie or theater..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Showtimes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Showtimes ({filteredShowtimes?.length || 0})</CardTitle>
            <CardDescription>All scheduled movie showtimes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-12 w-20 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !filteredShowtimes || filteredShowtimes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? "No showtimes found" : "No showtimes yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Start by scheduling your first movie showtime"}
                </p>
                <div className="text-xs text-blue-600 mb-6 bg-blue-100 rounded px-3 py-1 inline-block">
                  🚧 Showtime service is being configured
                </div>
                {!searchQuery && (
                  <Link href="/admin/showtimes/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Showtime
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie</TableHead>
                      <TableHead>Theater</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Available Seats</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShowtimes.map((showtime) => {
                      const dateTime = formatDateTime(showtime.showDateTime)
                      return (
                        <TableRow key={showtime.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-14 bg-gradient-to-br from-primary/10 to-secondary/20 rounded flex items-center justify-center text-xs">
                                🎬
                              </div>
                              <div>
                                <p className="font-medium">{showtime.movie?.title || "Unknown Movie"}</p>
                                <p className="text-sm text-muted-foreground">{showtime.movie?.genre}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{showtime.theater?.name || "Unknown Theater"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{dateTime.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{dateTime.time}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>${showtime.ticketPrice.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{showtime.availableSeats}</span>
                              <Badge
                                variant={showtime.availableSeats > 10 ? "default" : "destructive"}
                                className="ml-2"
                              >
                                {showtime.availableSeats > 10 ? "Available" : "Low"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/showtimes/${showtime.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Showtime</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this showtime? This action cannot be undone and
                                      will also cancel all associated bookings.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteShowtime(showtime.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
