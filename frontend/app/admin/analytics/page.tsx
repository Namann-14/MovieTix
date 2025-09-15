"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Users,
  Film,
  Ticket,
  Download
} from "lucide-react"

export default function AdminAnalyticsPage() {
  // Mock analytics data - replace with actual API calls
  const revenueData = [
    { month: "Jan", revenue: 8400 },
    { month: "Feb", revenue: 9200 },
    { month: "Mar", revenue: 7800 },
    { month: "Apr", revenue: 10500 },
    { month: "May", revenue: 11200 },
    { month: "Jun", revenue: 9800 },
  ]

  const topMovies = [
    { title: "Spider-Man: No Way Home", bookings: 145, revenue: 1887.55 },
    { title: "Avatar: The Way of Water", bookings: 132, revenue: 1716.00 },
    { title: "Top Gun: Maverick", bookings: 98, revenue: 1274.00 },
    { title: "Black Panther: Wakanda Forever", bookings: 87, revenue: 1131.00 },
    { title: "Doctor Strange", bookings: 76, revenue: 988.00 },
  ]

  const monthlyStats = [
    {
      title: "Monthly Revenue",
      value: "$12,450",
      change: "+15.3%",
      changeType: "positive",
      icon: DollarSign
    },
    {
      title: "Total Bookings", 
      value: "324",
      change: "+8.2%",
      changeType: "positive",
      icon: Ticket
    },
    {
      title: "New Customers",
      value: "45",
      change: "+12.1%", 
      changeType: "positive",
      icon: Users
    },
    {
      title: "Avg. Booking Value",
      value: "$38.42",
      change: "+3.5%",
      changeType: "positive",
      icon: TrendingUp
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">View sales reports and performance metrics</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monthlyStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <stat.icon className={`h-6 w-6 ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Monthly revenue for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(item.revenue / 12000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 min-w-[60px]">
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Movies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Film className="h-5 w-5 mr-2" />
              Top Performing Movies
            </CardTitle>
            <CardDescription>
              Movies with highest bookings this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{movie.title}</p>
                      <p className="text-sm text-gray-600">{movie.bookings} bookings</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    ${movie.revenue.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Customer behavior and demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Age</span>
                <span className="font-bold">28.5 years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Return Rate</span>
                <span className="font-bold text-green-600">73%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Peak Hours</span>
                <span className="font-bold">7-9 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Most Popular Day</span>
                <span className="font-bold">Saturday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theater Performance</CardTitle>
            <CardDescription>Occupancy and utilization rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Occupancy</span>
                <span className="font-bold text-blue-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best Performing</span>
                <span className="font-bold">Theater 1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Peak Capacity</span>
                <span className="font-bold">Weekend Shows</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Utilization Rate</span>
                <span className="font-bold text-green-600">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}