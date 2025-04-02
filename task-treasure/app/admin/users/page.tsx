import { getUsers } from "@/lib/users"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import { CheckCircle, LayoutDashboard, LogOut, Settings, ListTodo, FileCheck, Users, Mail, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

export default async function AdminUsers() {
  const session = await getSession()

  // If no session, this will be handled by the middleware
  if (!session) {
    return null
  }

  const users = await getUsers()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r">
          <div className="flex items-center gap-2 h-16 px-6 border-b">
            <CheckCircle className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              TaskTreasure
            </span>
          </div>
          <div className="flex-1 px-4 py-6 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/tasks"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              <ListTodo className="h-5 w-5" />
              Manage Tasks
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              <FileCheck className="h-5 w-5" />
              Review Submissions
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800"
            >
              <Users className="h-5 w-5" />
              User Management
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navbar */}
          <header className="bg-white border-b h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <span className="font-semibold">User Management</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {session?.username}</span>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </header>

          {/* Users content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">All Users</h2>
                </div>

                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Wallet Balance</th>
                          <th className="text-left py-3 px-4 font-medium">Joined</th>
                          <th className="text-left py-3 px-4 font-medium">Submissions</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-4">{user.full_name}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                {user.email}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Wallet className="h-4 w-4 mr-2 text-green-500" />₹{user.wallet?.balance || 0}
                              </div>
                            </td>
                            <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {user.approved_count || 0} Approved
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {user.pending_count || 0} Pending
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Link href={`/admin/users/${user.id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No users found.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

