"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ListTodo,
  FileCheck,
  Users,
  Check,
  X,
  ExternalLink,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getTaskSubmissions, updateSubmissionStatus } from "@/lib/tasks"
import { logout } from "@/lib/auth"
import type { TaskSubmission } from "@/lib/tasks"

export default function SubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [adminNotes, setAdminNotes] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  useEffect(() => {
    // Check if we have a session
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (!response.ok) {
          router.push("/admin")
          return
        }

        const data = await response.json()
        if (!data.authenticated) {
          router.push("/admin")
          return
        }

        setSession(data)
      } catch (error) {
        console.error("Error checking session:", error)
        router.push("/admin")
      }
    }

    checkSession()
  }, [router])

  useEffect(() => {
    if (!session) return

    const fetchSubmissions = async () => {
      try {
        const data = await getTaskSubmissions(activeTab)
        setSubmissions(data)
      } catch (error) {
        console.error("Error fetching submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [session, activeTab])

  const handleOpenDialog = (submission: TaskSubmission, actionType: "approve" | "reject") => {
    setSelectedSubmission(submission)
    setAction(actionType)
    setAdminNotes("")
    setDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedSubmission || !action) return

    setIsUpdating(true)

    try {
      const result = await updateSubmissionStatus(selectedSubmission.id, action, adminNotes)

      if (result.success) {
        // Refresh submissions
        const data = await getTaskSubmissions(activeTab)
        setSubmissions(data)
        setDialogOpen(false)
      } else {
        console.error("Error updating submission status:", result.message)
      }
    } catch (error) {
      console.error("Error updating submission status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!session) {
    return null
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
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/tasks"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <ListTodo className="h-5 w-5" />
              Manage Tasks
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800"
            >
              <FileCheck className="h-5 w-5" />
              Review Submissions
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Users className="h-5 w-5" />
              User Management
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-left"
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
              <span className="font-semibold">Review Submissions</span>
            </div>
            <div className="flex items-center gap-4">
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </header>

          {/* Submissions content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Task Submissions</h1>
                <p className="text-muted-foreground">Review and approve user task submissions</p>
              </div>

              <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                  {loading ? (
                    <div className="bg-white rounded-lg shadow border p-6 text-center">
                      <p>Loading submissions...</p>
                    </div>
                  ) : submissions.length > 0 ? (
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium">User</th>
                              <th className="text-left py-3 px-4 font-medium">Task</th>
                              <th className="text-left py-3 px-4 font-medium">UPI ID</th>
                              <th className="text-left py-3 px-4 font-medium">Submitted</th>
                              <th className="text-left py-3 px-4 font-medium">Screenshot</th>
                              <th className="text-left py-3 px-4 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map((submission) => (
                              <tr key={submission.id} className="border-b">
                                <td className="py-3 px-4">{submission.user?.full_name || submission.user?.email}</td>
                                <td className="py-3 px-4">{submission.task?.title}</td>
                                <td className="py-3 px-4">{submission.upi_id || "Not provided"}</td>
                                <td className="py-3 px-4">{new Date(submission.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                  <a
                                    href={submission.screenshot_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                  </a>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                      onClick={() => handleOpenDialog(submission, "approve")}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                      onClick={() => handleOpenDialog(submission, "reject")}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow border p-6 text-center">
                      <p className="text-muted-foreground">No pending submissions found.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                  {loading ? (
                    <div className="bg-white rounded-lg shadow border p-6 text-center">
                      <p>Loading submissions...</p>
                    </div>
                  ) : submissions.length > 0 ? (
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium">User</th>
                              <th className="text-left py-3 px-4 font-medium">Task</th>
                              <th className="text-left py-3 px-4 font-medium">UPI ID</th>
                              <th className="text-left py-3 px-4 font-medium">Reward</th>
                              <th className="text-left py-3 px-4 font-medium">Approved</th>
                              <th className="text-left py-3 px-4 font-medium">Screenshot</th>
                              <th className="text-left py-3 px-4 font-medium">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map((submission) => (
                              <tr key={submission.id} className="border-b">
                                <td className="py-3 px-4">{submission.user?.full_name || submission.user?.email}</td>
                                <td className="py-3 px-4">{submission.task?.title}</td>
                                <td className="py-3 px-4">{submission.upi_id || "Not provided"}</td>
                                <td className="py-3 px-4">₹{submission.task?.reward_amount}</td>
                                <td className="py-3 px-4">{new Date(submission.updated_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                  <a
                                    href={submission.screenshot_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                  </a>
                                </td>
                                <td className="py-3 px-4">
                                  {submission.admin_notes ? (
                                    <span className="flex items-center">
                                      <MessageSquare className="h-3 w-3 mr-1 text-gray-400" />
                                      {submission.admin_notes}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow border p-6 text-center">
                      <p className="text-muted-foreground">No approved submissions found.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                  {loading ? (
                    <div className="bg-white rounded-lg shadow border p-6 text-center">
                      <p>Loading submissions...</p>
                    </div>
                  ) : submissions.length > 0 ? (
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium">User</th>
                              <th className="text-left py-3 px-4 font-medium">Task</th>
                              <th className="text-left py-3 px-4 font-medium">UPI ID</th>
                              <th className="text-left py-3 px-4 font-medium">Rejected</th>
                              <th className="text-left py-3 px-4 font-medium">Screenshot</th>
                              <th className="text-left py-3 px-4 font-medium">Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map((submission) => (
                              <tr key={submission.id} className="border-b">
                                <td className="py-3 px-4">{submission.user?.full_name || submission.user?.email}</td>
                                <td className="py-3 px-4">{submission.task?.title}</td>
                                <td className="py-3 px-4">{submission.upi_id || "Not provided"}</td>
                                <td className="py-3 px-4">{new Date(submission.updated_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                  <a
                                    href={submission.screenshot_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                  </a>
                                </td>
                                <td className="py-3 px-4">
                                  {submission.admin_notes ? (
                                    <span className="flex items-center">
                                      <MessageSquare className="h-3 w-3 mr-1 text-gray-400" />
                                      {submission.admin_notes}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow border p-6 text-center">
                      <p className="text-muted-foreground">No rejected submissions found.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Approval/Rejection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve Submission" : "Reject Submission"}</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "Approving this submission will add the reward amount to the user's wallet."
                : "Please provide a reason for rejecting this submission."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Task</p>
              <p className="text-sm">{selectedSubmission?.task?.title}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">User</p>
              <p className="text-sm">{selectedSubmission?.user?.full_name || selectedSubmission?.user?.email}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">UPI ID for Payment</p>
              <p className="text-sm">{selectedSubmission?.upi_id || "Not provided"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                {action === "approve" ? "Admin Notes (Optional)" : "Rejection Reason"}
              </p>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={
                  action === "approve"
                    ? "Add any notes about this approval (optional)"
                    : "Explain why this submission is being rejected"
                }
                required={action === "reject"}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdating || (action === "reject" && !adminNotes)}
              className={action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isUpdating ? "Processing..." : action === "approve" ? "Approve Submission" : "Reject Submission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

