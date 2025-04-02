import Link from "next/link"
import { getSession, logout } from "@/lib/auth"
import { getTasks } from "@/lib/tasks"
import { CheckCircle, LayoutDashboard, LogOut, Settings, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const session = await getSession()

  // If no session, this will be handled by the layout
  if (!session) {
    return null
  }

  const tasks = await getTasks()

  const activeTasks = tasks.filter((task) => task.is_active).length
  const inactiveTasks = tasks.length - activeTasks

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r">
          <div className="flex items-center gap-2 h-16 px-6 border-b">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
              TaskTreasure
            </span>
          </div>
          <div className="flex-1 px-4 py-6 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
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
              <span className="font-semibold">Dashboard</span>
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

          {/* Dashboard content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                      <p className="text-3xl font-bold">{tasks.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <ListTodo className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Tasks</p>
                      <p className="text-3xl font-bold">{activeTasks}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Inactive Tasks</p>
                      <p className="text-3xl font-bold">{inactiveTasks}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <ListTodo className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                  <Link href="/admin/tasks">
                    <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                      Manage Tasks
                    </Button>
                  </Link>
                  <Link href="/admin/tasks?new=true">
                    <Button variant="outline">Add New Task</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
                {tasks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Title</th>
                          <th className="text-left py-3 px-4 font-medium">Category</th>
                          <th className="text-left py-3 px-4 font-medium">Reward</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.slice(0, 5).map((task) => (
                          <tr key={task.id} className="border-b">
                            <td className="py-3 px-4">{task.title}</td>
                            <td className="py-3 px-4">{task.category}</td>
                            <td className="py-3 px-4">₹{task.reward_amount}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tasks found. Create your first task!</p>
                )}

                {tasks.length > 5 && (
                  <div className="mt-4 text-right">
                    <Link href="/admin/tasks" className="text-sm text-blue-600 hover:underline">
                      View all tasks
                    </Link>
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

