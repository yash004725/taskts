"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTaskById } from "@/lib/tasks"
import type { Task } from "@/lib/tasks"
import { motion } from "framer-motion"

export default function TaskDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-center">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-center text-red-600">Task not found or has been removed.</p>
          <div className="mt-4 text-center">
            <Link href="/tasks">
              <Button variant="outline">Back to Tasks</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <Link href="/tasks" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tasks
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border overflow-hidden"
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {task.category}
            </span>
            <span className="font-bold text-green-600 text-xl">₹{task.reward_amount}</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-3">{task.title}</h1>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-600">{task.description}</p>
          </div>

          <div className="flex items-center text-xs text-gray-500 mb-6">
            <Clock className="h-3 w-3 mr-1" />
            <span>Easy task • Takes about 5 minutes</span>
          </div>

          {task.app_link ? (
            <a href={task.app_link} target="_blank" rel="noopener noreferrer" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
              >
                Complete This Task
                <ExternalLink className="ml-2 h-4 w-4" />
              </motion.button>
            </a>
          ) : (
            <Link href={`/dashboard/tasks/${task.id}`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium"
              >
                Complete This Task
              </motion.button>
            </Link>
          )}

          <p className="text-xs text-center text-gray-500 mt-3">You need to be logged in to submit task completion</p>
        </div>
      </motion.div>
    </div>
  )
}

