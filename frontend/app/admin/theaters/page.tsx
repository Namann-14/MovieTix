"use client"

import { useState } from "react"
import { useAdminTheaters, useCreateTheater, useUpdateTheater, useDeleteTheater } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2, MapPin, Users } from "lucide-react"
import { toast } from "sonner"
import type { Theater } from "@/lib/types"

interface TheaterFormData {
  name: string
  location: string
  seatingCapacity: number
}

export default function AdminTheatersPage() {
  const { data: theaters, isLoading } = useAdminTheaters()
  const createTheaterMutation = useCreateTheater()
  const updateTheaterMutation = useUpdateTheater()
  const deleteTheaterMutation = useDeleteTheater()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null)
  const [formData, setFormData] = useState<TheaterFormData>({
    name: "",
    location: "",
    seatingCapacity: 0,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      seatingCapacity: 0,
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTheaterMutation.mutateAsync(formData)
      toast.success("Theater created successfully")
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create theater")
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTheater) return
    
    try {
      await updateTheaterMutation.mutateAsync({ id: editingTheater.id, ...formData })
      toast.success("Theater updated successfully")
      setEditingTheater(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update theater")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTheaterMutation.mutateAsync(id)
      toast.success("Theater deleted successfully")
    } catch (error) {
      toast.error("Failed to delete theater")
    }
  }

  const openEditDialog = (theater: Theater) => {
    setEditingTheater(theater)
    setFormData({
      name: theater.name,
      location: theater.location,
      seatingCapacity: theater.seatingCapacity,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Theaters Management</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Theaters Management</h1>
          <p className="text-gray-600 mt-2">Manage your cinema theaters and venues</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Theater
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Theater</DialogTitle>
              <DialogDescription>
                Enter the theater details below to add it to your venues.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Theater Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cinema Hall 1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Seating Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.seatingCapacity}
                    onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 150"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Main Building, Floor 2"
                  required
                />
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
                <Button type="submit" disabled={createTheaterMutation.isPending}>
                  {createTheaterMutation.isPending ? "Creating..." : "Create Theater"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Theaters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            All Theaters ({theaters?.length || 0})
          </CardTitle>
          <CardDescription>
            Manage your theaters and their capacities. Configure venues for screenings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {theaters && theaters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Theater Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Seating Capacity</TableHead>
                  <TableHead>Info</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {theaters.map((theater) => (
                  <TableRow key={theater.id}>
                    <TableCell>
                      <div className="font-medium">{theater.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {theater.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center w-fit">
                        <Users className="h-3 w-3 mr-1" />
                        {theater.seatingCapacity} seats
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        Theater venue for screenings
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(theater)}
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
                              <AlertDialogTitle>Delete Theater</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{theater.name}"? This action cannot be undone and will also delete all associated showtimes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(theater.id)}
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
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No theaters found. Add your first theater to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTheater} onOpenChange={() => setEditingTheater(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Theater</DialogTitle>
            <DialogDescription>
              Update the theater details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Theater Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cinema Hall 1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-capacity">Seating Capacity *</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.seatingCapacity}
                  onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. 150"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Main Building, Floor 2"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingTheater(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTheaterMutation.isPending}>
                {updateTheaterMutation.isPending ? "Updating..." : "Update Theater"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}