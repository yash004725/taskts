"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle, LayoutDashboard, ListTodo, Wallet, FileCheck, LogOut } from "lucide-react"
import { signOut } from "@/lib/user-auth"

interface DashboardSidebarProps {
  user: {
    id: string
    email: string
    full_name: string
  }
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="hidden md:flex w-64 flex-col bg-white border-r">
      <div className="flex items-center gap-2 h-16 px-6 border-b">
        <CheckCircle className="h-6 w-6 text-green-500" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
          TaskTreasure
        </span>
      </div>

      <div className="p-4 border-b">
        <p className="font-medium truncate">{user.full_name}</p>
        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-md ${
            isActive("/dashboard")
              ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        <Link
          href="/dashboard/tasks"
          className={`flex items-center gap-3 px-3 py-2 rounded-md ${
            isActive("/dashboard/tasks")
              ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <ListTodo className="h-5 w-5" />
          Available Tasks
        </Link>

        <Link
          href="/dashboard/wallet"
          className={`flex items-center gap-3 px-3 py-2 rounded-md ${
            isActive("/dashboard/wallet")
              ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Wallet className="h-5 w-5" />
          My Wallet
        </Link>

        <Link
          href="/dashboard/submissions"
          className={`flex items-center gap-3 px-3 py-2 rounded-md ${
            isActive("/dashboard/submissions")
              ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <FileCheck className="h-5 w-5" />
          My Submissions
        </Link>

        <form action={signOut}>
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
  )
}

