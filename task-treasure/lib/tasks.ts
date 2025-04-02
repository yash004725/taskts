"use server"

import { createServerSupabaseClient } from "./supabase"
import { revalidatePath } from "next/cache"

export type Task = {
  id: number
  title: string
  description: string
  reward_amount: number
  category: string
  is_active: boolean
  image_url?: string
  app_link?: string
  completion_steps?: string
  created_at: string
}

export type Category = {
  id: number
  name: string
  icon: string
}

export type TaskSubmission = {
  id: string
  user_id: string
  task_id: number
  screenshot_url: string
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  upi_id?: string
  created_at: string
  updated_at: string
  task?: Task
  user?: {
    email: string
    full_name: string
  }
}

export async function getTasks(activeOnly = false) {
  const supabase = createServerSupabaseClient()

  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false })

  if (activeOnly) {
    query = query.eq("is_active", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching tasks:", error)
    return []
  }

  return data as Task[]
}

export async function getTaskById(id: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching task:", error)
    return null
  }

  return data as Task
}

export async function getCategories() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

export async function createTask(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const reward_amount = Number.parseFloat(formData.get("reward_amount") as string)
  const category = formData.get("category") as string
  const is_active = formData.get("is_active") === "on"
  const app_link = (formData.get("app_link") as string) || null
  const image_url = (formData.get("image_url") as string) || "/placeholder.svg?height=100&width=100"
  const completion_steps = (formData.get("completion_steps") as string) || null

  const { error } = await supabase.from("tasks").insert({
    title,
    description,
    reward_amount,
    category,
    is_active,
    app_link,
    image_url,
    completion_steps,
  })

  if (error) {
    console.error("Error creating task:", error)
    return { success: false, message: "Failed to create task" }
  }

  revalidatePath("/admin/tasks")
  revalidatePath("/")
  revalidatePath("/tasks")
  return { success: true, message: "Task created successfully" }
}

export async function updateTask(id: number, formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const reward_amount = Number.parseFloat(formData.get("reward_amount") as string)
  const category = formData.get("category") as string
  const is_active = formData.get("is_active") === "on"
  const app_link = (formData.get("app_link") as string) || null
  const image_url = (formData.get("image_url") as string) || null
  const completion_steps = (formData.get("completion_steps") as string) || null

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description,
      reward_amount,
      category,
      is_active,
      app_link,
      image_url,
      completion_steps,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating task:", error)
    return { success: false, message: "Failed to update task" }
  }

  revalidatePath("/admin/tasks")
  revalidatePath("/")
  revalidatePath("/tasks")
  revalidatePath(`/tasks/${id}`)
  return { success: true, message: "Task updated successfully" }
}

export async function updateTaskStatus(id: number, is_active: boolean) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("tasks")
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating task status:", error)
    return { success: false, message: "Failed to update task status" }
  }

  revalidatePath("/admin/tasks")
  revalidatePath("/")
  revalidatePath("/tasks")
  return { success: true, message: "Task status updated successfully" }
}

export async function deleteTask(id: number) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) {
    console.error("Error deleting task:", error)
    return { success: false, message: "Failed to delete task" }
  }

  revalidatePath("/admin/tasks")
  revalidatePath("/")
  revalidatePath("/tasks")
  return { success: true, message: "Task deleted successfully" }
}

export async function getTaskSubmissions(status?: string) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from("task_submissions")
    .select(`
      *,
      task:tasks(*),
      user:users(email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching task submissions:", error)
    return []
  }

  return data as TaskSubmission[]
}

export async function updateSubmissionStatus(id: string, status: "approved" | "rejected", adminNotes?: string) {
  const supabase = createServerSupabaseClient()

  // Start a transaction
  const { data: submission, error: fetchError } = await supabase
    .from("task_submissions")
    .select("*, task:tasks(*), user:users(id)")
    .eq("id", id)
    .single()

  if (fetchError || !submission) {
    console.error("Error fetching submission:", fetchError)
    return { success: false, message: "Failed to fetch submission" }
  }

  // Update submission status
  const { error: updateError } = await supabase
    .from("task_submissions")
    .update({
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error updating submission status:", updateError)
    return { success: false, message: "Failed to update submission status" }
  }

  // If approved, update wallet balance
  if (status === "approved") {
    const { error: walletError } = await supabase.rpc("increment_wallet_balance", {
      p_user_id: submission.user.id,
      p_amount: submission.task.reward_amount,
    })

    if (walletError) {
      console.error("Error updating wallet balance:", walletError)
      return { success: false, message: "Failed to update wallet balance" }
    }
  }

  revalidatePath("/admin/submissions")
  return { success: true, message: `Submission ${status} successfully` }
}

