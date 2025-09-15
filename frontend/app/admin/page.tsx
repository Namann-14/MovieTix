"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Film, 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  BarChart3,
  Settings,
  UserCheck,
  TrendingUp,
  Star,
  Ticket,
  Building
} from "lucide-react"

export default function AdminDashboard() {
  const managementSections = [
    {
      title: "Movies Management",
      description: "Add, edit, and remove movies from your catalog",
      icon: Film,
      href: "/admin/movies",
      color: "bg-blue-500",
      stats: "12 Active Movies"
    },
    {
      title: "Theaters Management", 
      description: "Manage theater locations and seating capacity",
      icon: Building,
      href: "/admin/theaters",
      color: "bg-green-500",
      stats: "5 Active Theaters"
    },
    {
      title: "Showtimes Management",
      description: "Schedule movie screenings and set pricing",
      icon: Clock,
      href: "/admin/showtimes", 
      color: "bg-purple-500",
      stats: "28 Scheduled Shows"
    },
    {
      title: "Bookings Overview",
      description: "View and manage customer bookings",
      icon: Ticket,
      href: "/admin/bookings",
      color: "bg-orange-500",
      stats: "156 Total Bookings"
    },
    {
      title: "User Management",
      description: "Manage customer accounts and permissions",
      icon: UserCheck,
      href: "/admin/users",
      color: "bg-red-500",
      stats: "89 Registered Users"
    },
    {
      title: "Analytics & Reports",
      description: "View sales reports and performance metrics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-teal-500",
      stats: "Revenue: $12,450"
    }
  ]

  const quickStats = [
    {
      title: "Today's Revenue",
      value: "$1,245",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Active Bookings",
      value: "34",
      change: "+5",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Total Customers",
      value: "89",
      change: "+8",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-600"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your MovieTix cinema system from this central hub
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Management Sections</h2>
          <Badge variant="secondary" className="text-sm">
            6 Available Modules
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${section.color} text-white`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {section.stats}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mt-4">
                  {section.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={section.href}>
                  <Button className="w-full" variant="outline">
                    Manage {section.title.split(' ')[0]}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest actions performed in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "New movie added",
                details: "Spider-Man: No Way Home added to catalog",
                time: "2 minutes ago",
                type: "movie"
              },
              {
                action: "Showtime scheduled",
                details: "Avatar 2 - Theater 1 - 7:30 PM",
                time: "15 minutes ago",
                type: "showtime"
              },
              {
                action: "Theater updated",
                details: "Theater 2 capacity increased to 200 seats",
                time: "1 hour ago", 
                type: "theater"
              },
              {
                action: "New booking",
                details: "Customer booked 2 tickets for Avengers",
                time: "2 hours ago",
                type: "booking"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'movie' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'showtime' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'theater' ? 'bg-green-100 text-green-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {activity.type === 'movie' && <Film className="h-4 w-4" />}
                  {activity.type === 'showtime' && <Clock className="h-4 w-4" />}
                  {activity.type === 'theater' && <MapPin className="h-4 w-4" />}
                  {activity.type === 'booking' && <Ticket className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}