"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient } from "./supabase"
import { redirect } from "next/navigation"

export async function login(username: string, password: string) {
  const supabase = createServerSupabaseClient()

  // Query the admin_users table to check credentials
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, username")
    .eq("username", username)
    .eq("password_hash", password)
    .single()

  if (error || !data) {
    return { success: false, message: "Invalid credentials" }
  }

  // Set a cookie to maintain the session
  cookies().set(
    "admin_session",
    JSON.stringify({
      id: data.id,
      username: data.username,
      authenticated: true,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    },
  )

  return { success: true, message: "Login successful" }
}

export async function logout() {
  cookies().delete("admin_session")
  redirect("/admin")
}

export async function getSession() {
  const sessionCookie = cookies().get("admin_session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch (error) {
    return null
  }
}

export async function checkAuth() {
  const session = await getSession()

  if (!session || !session.authenticated) {
    throw new Error("Not authenticated")
  }

  return session
}

