"use client"

import { useState } from "react"
import { 
  useAdminShowtimes, 
  useAdminMovies, 
  useAdminTheaters, 
  useCreateShowtime, 
  useUpdateShowtime, 
  useDeleteShowtime 
} from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
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
import { Plus, Pencil, Trash2, Clock, Calendar, DollarSign } from "lucide-react"
import { toast } from "sonner"
import type { Showtime, Movie, Theater } from "@/lib/types"

interface ShowtimeFormData {
  movieId: number
  theaterId: number
  showDateTime: string
  ticketPrice: number
  availableSeats: number
}

export default function AdminShowtimesPage() {
  const { data: showtimes, isLoading } = useAdminShowtimes()
  const { data: movies } = useAdminMovies()
  const { data: theaters } = useAdminTheaters()
  const createShowtimeMutation = useCreateShowtime()
  const updateShowtimeMutation = useUpdateShowtime()
  const deleteShowtimeMutation = useDeleteShowtime()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null)
  const [formData, setFormData] = useState<ShowtimeFormData>({
    movieId: 0,
    theaterId: 0,
    showDateTime: "",
    ticketPrice: 0,
    availableSeats: 0,
  })

  const resetForm = () => {
    setFormData({
      movieId: 0,
      theaterId: 0,
      showDateTime: "",
      ticketPrice: 0,
      availableSeats: 0,
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.movieId === 0 || formData.theaterId === 0) {
      toast.error("Please select a movie and theater")
      return
    }
    
    try {
      // Find the selected movie and theater to get their names
      const selectedMovie = movies?.find(m => m.id === formData.movieId)
      const selectedTheater = theaters?.find(t => t.id === formData.theaterId)
      
      if (!selectedMovie) {
        toast.error("Please select a valid movie")
        return
      }
      
      if (!selectedTheater) {
        toast.error("Please select a valid theater")
        return
      }

      await createShowtimeMutation.mutateAsync({
        ...formData,
        movieTitle: selectedMovie.title,
        theaterName: selectedTheater.name,
      })
      toast.success("Showtime created successfully")
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Showtime creation error:", error)
      if (error instanceof Error && error.message.includes("404")) {
        toast.error("Showtime service is temporarily unavailable. Please try again later.")
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to create showtime")
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShowtime || formData.movieId === 0 || formData.theaterId === 0) {
      toast.error("Please select a movie and theater")
      return
    }
    
    try {
      // Find the selected movie and theater to get their names
      const selectedMovie = movies?.find(m => m.id === formData.movieId)
      const selectedTheater = theaters?.find(t => t.id === formData.theaterId)
      
      if (!selectedMovie) {
        toast.error("Please select a valid movie")
        return
      }
      
      if (!selectedTheater) {
        toast.error("Please select a valid theater")
        return
      }

      await updateShowtimeMutation.mutateAsync({ 
        id: editingShowtime.id, 
        ...formData,
        movieTitle: selectedMovie.title,
        theaterName: selectedTheater.name,
      })
      toast.success("Showtime updated successfully")
      setEditingShowtime(null)
      resetForm()
    } catch (error) {
      console.error("Showtime update error:", error)
      if (error instanceof Error && error.message.includes("404")) {
        toast.error("Showtime service is temporarily unavailable. Please try again later.")
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to update showtime")
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteShowtimeMutation.mutateAsync(id)
      toast.success("Showtime deleted successfully")
    } catch (error) {
      console.error("Showtime deletion error:", error)
      if (error instanceof Error && error.message.includes("404")) {
        toast.error("Showtime service is temporarily unavailable. Please try again later.")
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to delete showtime")
      }
    }
  }

  const openEditDialog = (showtime: Showtime) => {
    setEditingShowtime(showtime)
    setFormData({
      movieId: showtime.movieId,
      theaterId: showtime.theaterId,
      showDateTime: showtime.showDateTime,
      ticketPrice: showtime.ticketPrice,
      availableSeats: showtime.availableSeats,
    })
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Showtimes Management</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Showtimes Management</h1>
          <p className="text-gray-600 mt-2">Schedule movie screenings across your theaters</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Showtime
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Showtime</DialogTitle>
              <DialogDescription>
                Select a movie, theater, and set the screening details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="movie">Movie *</Label>
                  <Select 
                    value={formData.movieId.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, movieId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a movie" />
                    </SelectTrigger>
                    <SelectContent>
                      {!movies || movies.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No movies available - Add movies first
                        </SelectItem>
                      ) : (
                        movies.map((movie) => (
                          <SelectItem key={movie.id} value={movie.id.toString()}>
                            {movie.title} ({movie.genre})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theater">Theater *</Label>
                  <Select 
                    value={formData.theaterId.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, theaterId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theater" />
                    </SelectTrigger>
                    <SelectContent>
                      {!theaters || theaters.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No theaters available - Add theaters first
                        </SelectItem>
                      ) : (
                        theaters.map((theater) => (
                          <SelectItem key={theater.id} value={theater.id.toString()}>
                            {theater.name} ({theater.seatingCapacity} seats)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="showDateTime">Show Date & Time *</Label>
                <Input
                  id="showDateTime"
                  type="datetime-local"
                  value={formData.showDateTime}
                  onChange={(e) => setFormData({ ...formData, showDateTime: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ticketPrice">Ticket Price ($) *</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="15.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="availableSeats">Available Seats *</Label>
                  <Input
                    id="availableSeats"
                    type="number"
                    value={formData.availableSeats}
                    onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) || 0 })}
                    placeholder="150"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createShowtimeMutation.isPending}>
                  {createShowtimeMutation.isPending ? "Scheduling..." : "Schedule Showtime"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Showtimes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            All Showtimes ({showtimes?.length || 0})
          </CardTitle>
          <CardDescription>
            Manage scheduled movie screenings across all theaters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showtimes && showtimes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead>Theater</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available Seats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showtimes.map((showtime) => (
                  <TableRow key={showtime.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {showtime.movie?.title || `Movie #${showtime.movieId}`}
                        </div>
                        {showtime.movie && (
                          <div className="text-sm text-gray-500">
                            {showtime.movie.genre} • {Math.floor(showtime.movie.durationInMinutes / 60)}h {showtime.movie.durationInMinutes % 60}m
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {showtime.theater?.name || `Theater #${showtime.theaterId}`}
                        </div>
                        {showtime.theater && (
                          <div className="text-sm text-gray-500">
                            {showtime.theater.location}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateTime(showtime.showDateTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center w-fit">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formatCurrency(showtime.ticketPrice)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        showtime.availableSeats > 50 
                          ? 'bg-green-100 text-green-800' 
                          : showtime.availableSeats > 10
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {showtime.availableSeats} left
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(showtime)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Showtime</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this showtime? This action cannot be undone and will cancel all existing bookings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(showtime.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No showtimes scheduled. Add your first showtime to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingShowtime} onOpenChange={() => setEditingShowtime(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Showtime</DialogTitle>
            <DialogDescription>
              Update the showtime details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-movie">Movie *</Label>
                <Select 
                  value={formData.movieId.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, movieId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a movie" />
                  </SelectTrigger>
                  <SelectContent>
                    {!movies || movies.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No movies available - Add movies first
                      </SelectItem>
                    ) : (
                      movies.map((movie) => (
                        <SelectItem key={movie.id} value={movie.id.toString()}>
                          {movie.title} ({movie.genre})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-theater">Theater *</Label>
                <Select 
                  value={formData.theaterId.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, theaterId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theater" />
                  </SelectTrigger>
                  <SelectContent>
                    {!theaters || theaters.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No theaters available - Add theaters first
                      </SelectItem>
                    ) : (
                      theaters.map((theater) => (
                        <SelectItem key={theater.id} value={theater.id.toString()}>
                          {theater.name} ({theater.seatingCapacity} seats)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-showDateTime">Show Date & Time *</Label>
              <Input
                id="edit-showDateTime"
                type="datetime-local"
                value={formData.showDateTime}
                onChange={(e) => setFormData({ ...formData, showDateTime: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-ticketPrice">Ticket Price ($) *</Label>
                <Input
                  id="edit-ticketPrice"
                  type="number"
                  step="0.01"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="15.99"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-availableSeats">Available Seats *</Label>
                <Input
                  id="edit-availableSeats"
                  type="number"
                  value={formData.availableSeats}
                  onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) || 0 })}
                  placeholder="150"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingShowtime(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateShowtimeMutation.isPending}>
                {updateShowtimeMutation.isPending ? "Updating..." : "Update Showtime"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}