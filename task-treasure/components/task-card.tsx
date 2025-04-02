"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import type { Task } from "@/lib/tasks"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-sm border p-4 text-center">
      <Link href={`/tasks/${task.id}`}>
        <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-purple-100">
          <CheckCircle className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{task.title}</h3>
        <p className="text-green-600 font-bold">₹{task.reward_amount}</p>
      </Link>
    </motion.div>
  )
}

