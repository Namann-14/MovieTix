"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useUpdateTheater } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiClient } from "@/lib/api"
import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Theater } from "@/lib/types"

export default function EditTheaterPage() {
  const router = useRouter()
  const params = useParams()
  const theaterId = params.id as string
  const updateTheaterMutation = useUpdateTheater()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  })

  const { data: theater, isLoading } = useQuery({
    queryKey: ["admin", "theater", theaterId],
    queryFn: () => ApiClient.get<Theater>(`/api/admin/theaters/${theaterId}`),
    enabled: !!theaterId,
  })

  useEffect(() => {
    if (theater) {
      setFormData({
        name: theater.name,
        location: theater.location,
        capacity: theater.capacity.toString(),
      })
    }
  }, [theater])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.location || !formData.capacity) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const capacity = Number.parseInt(formData.capacity)
    if (capacity <= 0) {
      toast({
        title: "Invalid capacity",
        description: "Theater capacity must be a positive number.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateTheaterMutation.mutateAsync({
        id: theaterId,
        name: formData.name,
        location: formData.location,
        capacity,
      })

      toast({
        title: "Theater updated",
        description: `"${formData.name}" has been successfully updated.`,
      })

      router.push("/admin/theaters")
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update theater.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!theater) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Theater Not Found</h1>
            <Link href="/admin/theaters">
              <Button>Back to Theaters</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link
          href="/admin/theaters"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Theaters
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Theater</h1>
          <p className="text-muted-foreground">Update theater information</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Theater Details
            </CardTitle>
            <CardDescription>Update the theater information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    Theater Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter theater name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter theater location/address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">
                    Seating Capacity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", e.target.value)}
                    placeholder="Enter total number of seats"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={updateTheaterMutation.isPending} className="flex-1">
                  {updateTheaterMutation.isPending ? "Updating..." : "Update Theater"}
                </Button>
                <Link href="/admin/theaters">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
