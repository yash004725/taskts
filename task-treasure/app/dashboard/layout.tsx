import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/user-auth"
import DashboardSidebar from "./dashboard-sidebar"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUserProfile()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <DashboardSidebar user={user} />
      <div className="flex-1">{children}</div>
    </div>
  )
}

