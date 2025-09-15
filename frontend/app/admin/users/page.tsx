"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { UserCheck, Search, Filter, Shield, Eye, Ban, UserPlus } from "lucide-react"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "ROLE_CUSTOMER",
      joinDate: "2025-08-15",
      status: "active",
      totalBookings: 12,
      lastActivity: "2025-09-14"
    },
    {
      id: 2,
      name: "Jane Smith", 
      email: "jane@example.com",
      role: "ROLE_CUSTOMER",
      joinDate: "2025-07-20",
      status: "active",
      totalBookings: 8,
      lastActivity: "2025-09-13"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "ROLE_CUSTOMER", 
      joinDate: "2025-09-01",
      status: "inactive",
      totalBookings: 3,
      lastActivity: "2025-09-10"
    },
    {
      id: 4,
      name: "Admin User",
      email: "admin@movietix.com",
      role: "ROLE_ADMIN",
      joinDate: "2025-01-01",
      status: "active", 
      totalBookings: 0,
      lastActivity: "2025-09-15"
    }
  ])

  const handleMakeAdmin = async (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: "ROLE_ADMIN" } : user
    ))
    toast.success("User promoted to admin successfully")
  }

  const handleToggleStatus = async (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ))
    toast.success("User status updated successfully")
  }

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800"
  }

  const getRoleBadge = (role: string) => {
    return role === "ROLE_ADMIN" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-blue-100 text-blue-800"
  }

  const activeUsers = users.filter(u => u.status === "active")
  const adminUsers = users.filter(u => u.role === "ROLE_ADMIN")
  const customerUsers = users.filter(u => u.role === "ROLE_CUSTOMER")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage customer accounts and permissions</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{activeUsers.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{adminUsers.length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{customerUsers.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or email..." 
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            All Users ({users.length})
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleBadge(user.role)}`}>
                      {user.role === "ROLE_ADMIN" ? "Admin" : "Customer"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadge(user.status)}`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{user.totalBookings}</TableCell>
                  <TableCell>{new Date(user.lastActivity).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {user.role === "ROLE_CUSTOMER" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-purple-600">
                              <Shield className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Make Admin</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to promote "{user.name}" to administrator? 
                                This will give them full access to the admin panel.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleMakeAdmin(user.id)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Make Admin
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={user.status === "active" ? "text-red-600" : "text-green-600"}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {user.status === "active" ? "Deactivate" : "Activate"} User
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to {user.status === "active" ? "deactivate" : "activate"} "{user.name}"? 
                              {user.status === "active" 
                                ? " They will no longer be able to access their account."
                                : " They will be able to access their account again."
                              }
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleToggleStatus(user.id)}
                              className={user.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                            >
                              {user.status === "active" ? "Deactivate" : "Activate"}
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
        </CardContent>
      </Card>
    </div>
  )
}