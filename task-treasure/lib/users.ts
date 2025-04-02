"use server"

import { createServerSupabaseClient } from "./supabase"

export type User = {
  id: string
  email: string
  full_name: string
  created_at: string
  wallet?: {
    balance: number
  }
  approved_count?: number
  pending_count?: number
  rejected_count?: number
}

export async function getUsers() {
  const supabase = createServerSupabaseClient()

  // Get users with their wallet balances
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      wallet:wallets(balance)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  // Get submission counts for each user
  const enhancedUsers = await Promise.all(
    users.map(async (user) => {
      // Get approved submissions count
      const { count: approvedCount } = await supabase
        .from("task_submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "approved")

      // Get pending submissions count
      const { count: pendingCount } = await supabase
        .from("task_submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "pending")

      // Get rejected submissions count
      const { count: rejectedCount } = await supabase
        .from("task_submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "rejected")

      return {
        ...user,
        approved_count: approvedCount,
        pending_count: pendingCount,
        rejected_count: rejectedCount,
      }
    }),
  )

  return enhancedUsers as User[]
}

export async function getUserById(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: user, error } = await supabase
    .from("users")
    .select(`
      *,
      wallet:wallets(balance)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  // Get submission counts
  const { count: approvedCount } = await supabase
    .from("task_submissions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id)
    .eq("status", "approved")

  const { count: pendingCount } = await supabase
    .from("task_submissions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id)
    .eq("status", "pending")

  const { count: rejectedCount } = await supabase
    .from("task_submissions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id)
    .eq("status", "rejected")

  // Get user's submissions
  const { data: submissions, error: submissionsError } = await supabase
    .from("task_submissions")
    .select(`
      *,
      task:tasks(*)
    `)
    .eq("user_id", id)
    .order("created_at", { ascending: false })

  if (submissionsError) {
    console.error("Error fetching user submissions:", submissionsError)
  }

  return {
    ...user,
    approved_count: approvedCount,
    pending_count: pendingCount,
    rejected_count: rejectedCount,
    submissions: submissions || [],
  } as User & { submissions: any[] }
}

