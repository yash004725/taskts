"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Smartphone, FileText, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTasks, getCategories } from "@/lib/tasks"
import { motion } from "framer-motion"

export default async function Home() {
  // Fetch active tasks and categories
  const activeTasks = await getTasks(true)
  const categories = await getCategories()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              TaskTreasure
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                  Complete Tasks, Earn Money!
                </h1>
                <p className="text-gray-600 mb-6">
                  TaskTreasure is a simple platform where anyone can earn money by completing small tasks. No special
                  skills needed!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Start Earning Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Available Tasks Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Tasks</h2>
              <p className="text-gray-600">Choose from various simple tasks and start earning today!</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {activeTasks.length > 0 ? (
                activeTasks.slice(0, 8).map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm border p-4 text-center"
                  >
                    <Link href={`/tasks/${task.id}`}>
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-purple-100">
                        <CheckCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{task.title}</h3>
                      <p className="text-green-600 font-bold">₹{task.reward_amount}</p>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No active tasks available at the moment. Please check back later.</p>
                </div>
              )}
            </div>

            {activeTasks.length > 8 && (
              <div className="mt-6 text-center">
                <Link href="/tasks">
                  <Button variant="outline" className="bg-white">
                    View All Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Categories</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border p-4 text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-purple-100`}>
                    {category.icon === "smartphone" && <Smartphone className="h-6 w-6 text-purple-600" />}
                    {category.icon === "file-text" && <FileText className="h-6 w-6 text-purple-600" />}
                    {category.icon === "share2" && <Share2 className="h-6 w-6 text-purple-600" />}
                    {!["smartphone", "file-text", "share2"].includes(category.icon) && (
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="mb-6 max-w-2xl mx-auto">Join TaskTreasure today and make your first ₹500 easily!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="font-bold text-gray-900">TaskTreasure</span>
            </div>
            <p className="text-sm text-gray-500">© 2025 TaskTreasure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

