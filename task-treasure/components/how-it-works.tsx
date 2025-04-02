"use client"

import { motion } from "framer-motion"
import { UserPlus, ListChecks, Wallet } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="h-6 w-6 text-white" />,
      title: "Sign Up For Free",
      description: "Create your account in seconds. No fees, no commitments.",
    },
    {
      icon: <ListChecks className="h-6 w-6 text-white" />,
      title: "Pick a Task",
      description: "Choose from various simple tasks that match your interests.",
    },
    {
      icon: <Wallet className="h-6 w-6 text-white" />,
      title: "Complete & Earn",
      description: "Finish the task and get paid directly to your account.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-600">Start earning in three simple steps. No special skills required!</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {steps.map((step, index) => (
            <motion.div key={index} className="bg-white rounded-xl shadow-sm border p-6 text-center" variants={item}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

