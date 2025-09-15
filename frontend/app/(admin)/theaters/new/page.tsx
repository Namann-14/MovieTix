"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateTheater } from "@/lib/hooks"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NewTheaterPage() {
  const router = useRouter()
  const createTheaterMutation = useCreateTheater()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    seatingCapacity: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.location || !formData.seatingCapacity) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const capacity = Number.parseInt(formData.seatingCapacity)
    if (capacity <= 0) {
      toast({
        title: "Invalid capacity",
        description: "Theater capacity must be a positive number.",
        variant: "destructive",
      })
      return
    }

    try {
      await createTheaterMutation.mutateAsync({
        name: formData.name,
        location: formData.location,
        seatingCapacity: capacity,
      })

      toast({
        title: "Theater created",
        description: `"${formData.name}" has been successfully added.`,
      })

      router.push("/admin/theaters")
    } catch (error) {
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create theater.",
        variant: "destructive",
      })
    }
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
          <h1 className="text-3xl font-bold mb-2">Add New Theater</h1>
          <p className="text-muted-foreground">Create a new theater location</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Theater Details
            </CardTitle>
            <CardDescription>Enter the theater information below</CardDescription>
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
                  <Label htmlFor="seatingCapacity">
                    Seating Capacity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="seatingCapacity"
                    type="number"
                    min="1"
                    value={formData.seatingCapacity}
                    onChange={(e) => handleInputChange("seatingCapacity", e.target.value)}
                    placeholder="Enter total number of seats"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={createTheaterMutation.isPending} className="flex-1">
                  {createTheaterMutation.isPending ? "Creating..." : "Create Theater"}
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
