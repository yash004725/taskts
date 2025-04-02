"use server"

import { createServerSupabaseClient } from "./supabase"

export async function createStorageBuckets() {
  const supabase = createServerSupabaseClient()

  // Create a bucket for task screenshots if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets()

  if (!buckets?.find((bucket) => bucket.name === "task-screenshots")) {
    const { error } = await supabase.storage.createBucket("task-screenshots", {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg"],
    })

    if (error) {
      console.error("Error creating storage bucket:", error)
      return { success: false, message: "Failed to create storage bucket" }
    }
  }

  return { success: true, message: "Storage bucket created or already exists" }
}

// Call this function during app initialization
createStorageBuckets()

