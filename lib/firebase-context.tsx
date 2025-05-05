"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE-dDeaaY_sDnECh2PmvA0LZqfJWxbfns",
  authDomain: "digital-hub-2d410.firebaseapp.com",
  projectId: "digital-hub-2d410",
  storageBucket: "digital-hub-2d410.firebasestorage.app",
  messagingSenderId: "1007810821342",
  appId: "1:1007810821342:web:b729416b526e184d30164f",
  measurementId: "G-F521D2S2KF",
}

// Initialize Firebase if it hasn't been initialized yet
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined
let analytics: any | undefined

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    // Only initialize analytics on the client side
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app)
    }
  } else {
    app = getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    // Only initialize analytics on the client side
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app)
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Context type
type FirebaseContextType = {
  app: FirebaseApp | undefined
  auth: Auth | undefined
  db: Firestore | undefined
  storage: FirebaseStorage | undefined
  analytics: any | undefined
  isInitialized: boolean
}

// Create context
const FirebaseContext = createContext<FirebaseContextType>({
  app: undefined,
  auth: undefined,
  db: undefined,
  storage: undefined,
  analytics: undefined,
  isInitialized: false,
})

// Provider component
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Check if Firebase is initialized
    if (app && auth && db && storage) {
      setIsInitialized(true)
    }
  }, [])

  return (
    <FirebaseContext.Provider value={{ app, auth, db, storage, analytics, isInitialized }}>
      {children}
    </FirebaseContext.Provider>
  )
}

// Custom hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
