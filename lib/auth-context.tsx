"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { useFirebase } from "./firebase-context"
import { doc, getDoc, setDoc } from "firebase/firestore"

// Context type
type AuthContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebase = useFirebase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  const checkAdminStatus = async (user: User) => {
    if (!firebase.db) return false

    try {
      // Check if the email is the admin email
      if (user.email === "yashkr2580@gmail.com") {
        setIsAdmin(true)

        // Ensure admin user exists in Firestore
        const userRef = doc(firebase.db, "users", user.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          // Create admin user document if it doesn't exist
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Admin User",
            isAdmin: true,
            createdAt: new Date().toISOString(),
          })
        } else if (!userSnap.data().isAdmin) {
          // Update user to be admin if not already
          await setDoc(userRef, { isAdmin: true }, { merge: true })
        }

        return true
      }

      const userRef = doc(firebase.db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        setIsAdmin(userSnap.data().isAdmin === true)
        return userSnap.data().isAdmin === true
      } else {
        setIsAdmin(false)
        return false
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
      return false
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    if (!firebase.auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(firebase.auth, async (user) => {
      setUser(user)

      if (user) {
        await checkAdminStatus(user)
      } else {
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [firebase.auth, firebase.db])

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string) => {
    if (!firebase.auth || !firebase.db) {
      throw new Error("Firebase not initialized")
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password)

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName })

      // Create user document in Firestore
      await setDoc(doc(firebase.db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName,
        isAdmin: email === "yashkr2580@gmail.com", // Set admin status based on email
        createdAt: new Date().toISOString(),
      })

      setUser(userCredential.user)

      // Check admin status
      await checkAdminStatus(userCredential.user)
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!firebase.auth) {
      throw new Error("Firebase not initialized")
    }

    try {
      const userCredential = await signInWithEmailAndPassword(firebase.auth, email, password)
      setUser(userCredential.user)
      await checkAdminStatus(userCredential.user)

      // Create a session cookie for the user
      const idToken = await userCredential.user.getIdToken()

      // Send the token to your backend to create a session cookie
      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      })

      return userCredential.user
    } catch (error: any) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  // Log out function
  const logOut = async () => {
    if (!firebase.auth) {
      throw new Error("Firebase not initialized")
    }

    try {
      await signOut(firebase.auth)

      // Clear the session cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUp, signIn, logOut }}>{children}</AuthContext.Provider>
  )
}

// Custom hook to use the Auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Function to get the current user without using the hook
export async function getCurrentUser() {
  if (typeof window === "undefined") return null

  const { auth } = await import("./firebase-config")

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}
