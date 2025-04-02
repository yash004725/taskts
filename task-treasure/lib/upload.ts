"use server"

import { createServerSupabaseClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

export async function uploadScreenshot(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const file = formData.get("file") as File

  if (!file) {
    return { success: false, url: null, message: "No file provided" }
  }

  // Generate a unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `screenshots/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from("task-screenshots").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading file:", error)
    return { success: false, url: null, message: "Failed to upload file" }
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("task-screenshots").getPublicUrl(filePath)

  return { success: true, url: publicUrl, message: "File uploaded successfully" }
}

export async function uploadTaskImage(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const file = formData.get("file") as File

  if (!file) {
    return { success: false, url: null, message: "No file provided" }
  }

  // Generate a unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `task-images/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from("task-screenshots").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading file:", error)
    return { success: false, url: null, message: "Failed to upload file" }
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("task-screenshots").getPublicUrl(filePath)

  return { success: true, url: publicUrl, message: "File uploaded successfully" }
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

