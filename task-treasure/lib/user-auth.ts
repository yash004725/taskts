"use server"

import { createServerSupabaseClient } from "./supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signUp(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  // Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { success: false, message: authError.message }
  }

  // Create the user profile in our users table
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user?.id,
    email,
    password_hash: "HASHED_IN_AUTH", // We don't store actual passwords, auth handles this
    full_name: fullName,
  })

  if (profileError) {
    return { success: false, message: profileError.message }
  }

  // Create a wallet for the user
  const { error: walletError } = await supabase.from("wallets").insert({
    user_id: authData.user?.id,
    balance: 0,
  })

  if (walletError) {
    return { success: false, message: walletError.message }
  }

  return { success: true, message: "Account created successfully! Please sign in." }
}

export async function signIn(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "Signed in successfully!" }
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  cookies().delete("supabase-auth-token")
  redirect("/")
}

export async function getUserProfile() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (error || !data) {
    return null
  }

  return data
}

export async function getWalletBalance() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("wallets").select("balance").eq("user_id", user.id).single()

  if (error || !data) {
    return null
  }

  return data.balance
}

export async function getUserSubmissions() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("task_submissions")
    .select(`
    *,
    task:tasks(*)
  `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user submissions:", error)
    return []
  }

  return data
}

export async function submitTaskCompletion(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to submit a task" }
  }

  const taskId = Number.parseInt(formData.get("taskId") as string)
  const screenshotUrl = formData.get("screenshotUrl") as string
  const upiId = formData.get("upiId") as string

  if (!screenshotUrl) {
    return { success: false, message: "Screenshot is required" }
  }

  if (!upiId) {
    return { success: false, message: "UPI ID is required for payment" }
  }

  const { error } = await supabase.from("task_submissions").insert({
    user_id: user.id,
    task_id: taskId,
    screenshot_url: screenshotUrl,
    upi_id: upiId,
    status: "pending",
  })

  if (error) {
    console.error("Error submitting task:", error)
    return { success: false, message: "Failed to submit task" }
  }

  revalidatePath("/dashboard")
  return { success: true, message: "Task submitted successfully! Awaiting admin review." }
}

