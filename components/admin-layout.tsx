"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Package,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  ShoppingBag,
  Building,
  FileText,
} from "lucide-react"
import AdminAuthCheck from "@/components/admin-auth-check"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [adminId, setAdminId] = useState("")

  useEffect(() => {
    // Get admin ID from localStorage
    const storedAdminId = localStorage.getItem("adminId")
    if (storedAdminId) {
      setAdminId(storedAdminId)
    }
  }, [])

  const handleLogout = () => {
    // Clear admin session from localStorage
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminId")

    // Redirect to login page
    router.push("/admin/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Purchases", href: "/admin/purchases", icon: ShoppingBag },
    { name: "Company", href: "/admin/company", icon: Building },
    { name: "Banners", href: "/admin/banners", icon: FileText },
    { name: "Activity", href: "/admin/activity", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-gray-100">
        {/* Mobile menu */}
        <div className="lg:hidden">
          <div className="fixed inset-0 flex z-40">
            <div
              className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300 ${
                isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            <div
              className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform ease-in-out duration-300 ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link href="/admin" className="text-xl font-bold text-blue-600">
                    Admin Dashboard
                  </Link>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        pathname === item.href
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 ${
                          pathname === item.href ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <div className="bg-blue-600 rounded-full h-9 w-9 flex items-center justify-center text-white font-semibold">
                      {adminId.substring(0, 1).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">{adminId}</p>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/admin" className="text-xl font-bold text-blue-600">
                  Admin Dashboard
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        pathname === item.href ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <div className="bg-blue-600 rounded-full h-9 w-9 flex items-center justify-center text-white font-semibold">
                    {adminId.substring(0, 1).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{adminId}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Site
                    </Link>
                  </Button>
                </div>
                <div className="hidden lg:flex lg:items-center lg:justify-between mb-4">
                  <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Site
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
