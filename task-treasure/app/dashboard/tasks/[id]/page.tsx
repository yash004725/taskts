"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, CheckCircle, Smartphone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getTaskById } from "@/lib/tasks"
import { uploadScreenshot, submitTaskCompletion } from "@/lib/upload"
import type { Task } from "@/lib/tasks"

export default function TaskDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [upiId, setUpiId] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTaskById(Number.parseInt(params.id))
        setTask(taskData)
      } catch (error) {
        console.error("Error fetching task:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      // Check file type
      if (!["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
        setError("Please upload a valid image file (JPEG, PNG)")
        setFile(null)
        setPreview(null)
        return
      }

      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB")
        setFile(null)
        setPreview(null)
        return
      }

      setFile(selectedFile)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)

      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload a screenshot of your completed task")
      return
    }

    if (!upiId) {
      setError("Please enter your UPI ID for payment")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      // Upload the screenshot
      const formData = new FormData()
      formData.append("file", file)

      const uploadResult = await uploadScreenshot(formData)

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.message || "Failed to upload screenshot")
      }

      // Submit the task completion
      const taskFormData = new FormData()
      taskFormData.append("taskId", params.id)
      taskFormData.append("screenshotUrl", uploadResult.url)
      taskFormData.append("upiId", upiId)

      const submissionResult = await submitTaskCompletion(taskFormData)

      if (submissionResult.success) {
        setSuccess(submissionResult.message)

        // Reset form
        setFile(null)
        setPreview(null)
        setUpiId("")

        // Redirect after success
        setTimeout(() => {
          router.push("/dashboard/submissions")
        }, 2000)
      } else {
        setError(submissionResult.message)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow border p-6">
            <p className="text-center">Loading task details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow border p-6">
            <p className="text-center text-red-600">Task not found or has been removed.</p>
            <div className="mt-4 text-center">
              <Link href="/dashboard/tasks">
                <Button variant="outline">Back to Tasks</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link
            href="/dashboard/tasks"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tasks
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow border p-6 mb-6">
          {task.image_url && task.image_url !== "/placeholder.svg?height=100&width=100" && (
            <div className="mb-6">
              <img
                src={task.image_url || "/placeholder.svg"}
                alt={task.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {task.category}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          <div className="flex items-center mb-6">
            <span className="text-xl font-bold text-green-600">₹{task.reward_amount}</span>
          </div>

          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-medium mb-2">Task Description</h3>
            <p>{task.description}</p>
          </div>

          {task.completion_steps && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                How to Complete This Task
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{task.completion_steps}</div>
            </div>
          )}

          {task.app_link && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Task Link</h3>
              <p className="mb-3 text-sm">Complete the task by visiting this link:</p>
              <a
                href={task.app_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-md"
              >
                <Smartphone className="h-4 w-4" />
                Open Task Link
              </a>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Submit Task Completion</h2>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="screenshot">Upload Screenshot Proof</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Screenshot preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFile(null)
                        setPreview(null)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop a screenshot showing your completed task
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</p>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("screenshot")?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upiId">Your UPI ID for Payment</Label>
              <Input
                id="upiId"
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your UPI ID where you want to receive payment after task verification
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={uploading || !file}
            >
              {uploading ? "Submitting..." : "Submit Task Completion"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

