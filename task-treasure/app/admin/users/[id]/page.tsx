import { getUserById } from "@/lib/users"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import {
  CheckCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ListTodo,
  FileCheck,
  Users,
  Mail,
  Wallet,
  Calendar,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

export default async function UserDetail({ params }: { params: { id: string } }) {
  const session = await getSession()

  // If no session, this will be handled by the middleware
  if (!session) {
    return null
  }

  const user = await getUserById(params.id)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold mb-4">User not found</h1>
          <Link href="/admin/users">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
              <Link
                href="/admin/users"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Users
              </Link>
              <span className="font-semibold">User Details</span>
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

          {/* User details content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow border p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{user.full_name}</h1>
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Wallet Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">₹{user.wallet?.balance || 0}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved Submissions</p>
                      <p className="text-3xl font-bold">{user.approved_count || 0}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Submissions</p>
                      <p className="text-3xl font-bold">{user.pending_count || 0}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FileCheck className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-3xl font-bold">₹{user.wallet?.balance || 0}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Wallet className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Submissions */}
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Submission History</h2>
                </div>

                {user.submissions && user.submissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Task</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">UPI ID</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Reward</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.submissions.map((submission) => (
                          <tr key={submission.id} className="border-b">
                            <td className="py-3 px-4">{submission.task?.title}</td>
                            <td className="py-3 px-4">{new Date(submission.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{submission.upi_id || "Not provided"}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  submission.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : submission.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {submission.status === "approved" ? `₹${submission.task?.reward_amount}` : "-"}
                            </td>
                            <td className="py-3 px-4">
                              <a
                                href={submission.screenshot_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Screenshot
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No submissions found for this user.</p>
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

