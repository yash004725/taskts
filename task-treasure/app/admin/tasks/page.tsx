"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ListTodo,
  Plus,
  Trash2,
  Check,
  X,
  LinkIcon,
  ImageIcon,
  FileCheck,
  Edit,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { logout } from "@/lib/auth"
import {
  getTasks,
  getCategories,
  createTask,
  updateTaskStatus,
  deleteTask,
  type Task,
  type Category,
} from "@/lib/tasks"
import { uploadTaskImage } from "@/lib/upload"

export default function TasksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showNewTaskForm = searchParams.get("new") === "true"

  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(showNewTaskForm)
  const [formMessage, setFormMessage] = useState({ type: "", message: "" })
  const [session, setSession] = useState<any>(null)
  const [taskImage, setTaskImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    const fetchData = async () => {
      try {
        const [tasksData, categoriesData] = await Promise.all([getTasks(), getCategories()])
        setTasks(tasksData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFormMessage({ type: "error", message: "Please upload a valid image file (JPEG, PNG)" })
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormMessage({ type: "error", message: "Image size should be less than 2MB" })
      return
    }

    setTaskImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormMessage({ type: "", message: "" })
    setUploading(true)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      // Upload image if selected
      let imageUrl = null
      if (taskImage) {
        const imageFormData = new FormData()
        imageFormData.append("file", taskImage)

        const uploadResult = await uploadTaskImage(imageFormData)

        if (!uploadResult.success) {
          throw new Error(uploadResult.message || "Failed to upload image")
        }

        imageUrl = uploadResult.url
      }

      // Add image URL to form data if available
      if (imageUrl) {
        formData.append("image_url", imageUrl)
      }

      const result = await createTask(formData)

      if (result.success) {
        setFormMessage({ type: "success", message: result.message })
        form.reset()
        setTaskImage(null)
        setImagePreview(null)

        // Refresh tasks
        const tasksData = await getTasks()
        setTasks(tasksData)

        // Hide form after successful submission
        setTimeout(() => {
          setShowForm(false)
          setFormMessage({ type: "", message: "" })
        }, 2000)
      } else {
        setFormMessage({ type: "error", message: result.message })
      }
    } catch (error: any) {
      console.error("Error creating task:", error)
      setFormMessage({ type: "error", message: error.message || "An error occurred. Please try again." })
    } finally {
      setUploading(false)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await updateTaskStatus(id, !currentStatus)

      // Update local state
      setTasks(tasks.map((task) => (task.id === id ? { ...task, is_active: !currentStatus } : task)))
    } catch (error) {
      console.error("Error toggling task status:", error)
    }
  }

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      await deleteTask(id)

      // Update local state
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
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
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800"
            >
              <ListTodo className="h-5 w-5" />
              Manage Tasks
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
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
              <span className="font-semibold">Manage Tasks</span>
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

          {/* Tasks content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Task Management</h1>
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className={
                    showForm
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  }
                >
                  {showForm ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Task
                    </>
                  )}
                </Button>
              </div>

              {/* New Task Form */}
              {showForm && (
                <div className="bg-white rounded-lg shadow border p-6 mb-8">
                  <h2 className="text-lg font-semibold mb-4">Add New Task</h2>

                  {formMessage.message && (
                    <div
                      className={`mb-4 p-3 rounded-md text-sm ${
                        formMessage.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {formMessage.message}
                    </div>
                  )}

                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input id="title" name="title" placeholder="Enter task title" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter task description"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completion_steps">How to Complete This Task</Label>
                      <Textarea
                        id="completion_steps"
                        name="completion_steps"
                        placeholder="Enter step-by-step instructions for completing this task"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500">
                        Provide clear instructions for users on how to complete this task
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue={categories[0]?.name || ""} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reward_amount">Reward Amount (₹)</Label>
                        <Input
                          id="reward_amount"
                          name="reward_amount"
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Enter reward amount"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="app_link">App Link</Label>
                      <Input id="app_link" name="app_link" type="url" placeholder="Enter app or website link" />
                      <p className="text-xs text-gray-500">
                        Users will be directed to this link when completing the task
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Task Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        {imagePreview ? (
                          <div className="space-y-4">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Task preview"
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setTaskImage(null)
                                setImagePreview(null)
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = ""
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Upload an image for this task (optional)</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 2MB)</p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                              Select Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="is_active" name="is_active" defaultChecked />
                      <Label htmlFor="is_active">Active</Label>
                    </div>

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={uploading}
                    >
                      {uploading ? "Creating Task..." : "Create Task"}
                    </Button>
                  </form>
                </div>
              )}

              {/* Tasks List */}
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">All Tasks</h2>
                </div>

                {loading ? (
                  <div className="p-6 text-center">
                    <p>Loading tasks...</p>
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Image</th>
                          <th className="text-left py-3 px-4 font-medium">Title</th>
                          <th className="text-left py-3 px-4 font-medium">Category</th>
                          <th className="text-left py-3 px-4 font-medium">Reward</th>
                          <th className="text-left py-3 px-4 font-medium">App Link</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => (
                          <tr key={task.id} className="border-b">
                            <td className="py-3 px-4">
                              {task.image_url ? (
                                <img
                                  src={task.image_url || "/placeholder.svg"}
                                  alt={task.title}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">{task.title}</td>
                            <td className="py-3 px-4">{task.category}</td>
                            <td className="py-3 px-4">₹{task.reward_amount}</td>
                            <td className="py-3 px-4">
                              {task.app_link ? (
                                <a
                                  href={task.app_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center"
                                >
                                  <LinkIcon className="h-3 w-3 mr-1" />
                                  Link
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(task.id, task.is_active)}
                                  title={task.is_active ? "Deactivate" : "Activate"}
                                >
                                  {task.is_active ? (
                                    <X className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                                <Link href={`/admin/tasks/edit/${task.id}`}>
                                  <Button variant="outline" size="sm" title="Edit">
                                    <Edit className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteTask(task.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No tasks found. Create your first task!</p>
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

