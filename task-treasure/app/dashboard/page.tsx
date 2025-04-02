import { getUserProfile, getWalletBalance, getUserSubmissions } from "@/lib/user-auth"
import { getTasks } from "@/lib/tasks"
import { CheckCircle, Wallet, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Dashboard() {
  const user = await getUserProfile()
  const balance = await getWalletBalance()
  const submissions = await getUserSubmissions()
  const activeTasks = await getTasks(true)

  const pendingSubmissions = submissions.filter((sub) => sub.status === "pending").length
  const approvedSubmissions = submissions.filter((sub) => sub.status === "approved").length
  const rejectedSubmissions = submissions.filter((sub) => sub.status === "rejected").length

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.full_name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/dashboard/tasks">
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                Find Tasks
              </Button>
            </Link>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-3xl font-bold">₹{balance || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
                <p className="text-3xl font-bold">{approvedSubmissions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Submissions</p>
                <p className="text-3xl font-bold">{pendingSubmissions}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Tasks</h2>

          {activeTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="border rounded-lg p-4 bg-gradient-to-br from-white to-blue-50">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className="text-green-600 font-bold">₹{task.reward_amount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{task.category}</span>
                    <Link href={`/dashboard/tasks/${task.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No active tasks available at the moment.</p>
          )}

          {activeTasks.length > 3 && (
            <div className="mt-4 text-center">
              <Link href="/dashboard/tasks">
                <Button variant="outline">View All Tasks</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>

          {submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Task</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 5).map((submission) => (
                    <tr key={submission.id} className="border-b">
                      <td className="py-3 px-4">{submission.task?.title}</td>
                      <td className="py-3 px-4">{new Date(submission.created_at).toLocaleDateString()}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No submissions yet. Complete tasks to earn rewards!</p>
          )}

          {submissions.length > 5 && (
            <div className="mt-4 text-right">
              <Link href="/dashboard/submissions" className="text-sm text-blue-600 hover:underline">
                View all submissions
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

