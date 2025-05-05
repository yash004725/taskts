"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, Filter, User } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState("all")

  // Fetch activity logs
  useEffect(() => {
    const activityQuery = query(collection(db, "activity"), orderBy("timestamp", "desc"), limit(100))

    const unsubscribe = onSnapshot(
      activityQuery,
      (snapshot) => {
        const activityData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }))

        setActivities(activityData)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching activity logs:", error)
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Fetch users for filtering
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, "users"))
        const usersSnapshot = await getDocs(usersQuery)

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      (activity.action && activity.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (activity.userId && activity.userId.toLowerCase().includes(searchQuery.toLowerCase()))

    // Type filter
    const matchesType =
      filterType === "all" ||
      (filterType === "admin" && activity.isAdminAction) ||
      (filterType === "user" && !activity.isAdminAction)

    // User filter
    const matchesUser = selectedUser === "all" || activity.userId === selectedUser

    return matchesSearch && matchesType && matchesUser
  })

  // Get activity type label
  const getActivityTypeLabel = (activity: any) => {
    if (activity.isAdminAction) {
      return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Admin</span>
    }

    if (activity.action.toLowerCase().includes("login")) {
      return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Auth</span>
    }

    if (activity.action.toLowerCase().includes("order") || activity.action.toLowerCase().includes("purchase")) {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Order</span>
    }

    if (activity.action.toLowerCase().includes("product")) {
      return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Product</span>
    }

    return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Other</span>
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Activity Log</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search activities..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="admin">Admin Actions</SelectItem>
                <SelectItem value="user">User Actions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[180px]">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.displayName || user.email || user.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Recent actions performed by users and administrators</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No activity logs found matching your filters</div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 border-b pb-4">
                    <div className="mt-1">{getActivityTypeLabel(activity)}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{activity.timestamp.toLocaleString()}</span>
                        {activity.userId && (
                          <>
                            <span>•</span>
                            <span>User: {activity.userEmail || activity.userId}</span>
                          </>
                        )}
                        {activity.ip && (
                          <>
                            <span>•</span>
                            <span>IP: {activity.ip}</span>
                          </>
                        )}
                      </div>
                      {activity.details && (
                        <p className="text-sm mt-1 text-gray-600">
                          {typeof activity.details === "object" ? JSON.stringify(activity.details) : activity.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
