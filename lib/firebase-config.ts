import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(firebaseApp)

// Initialize Firestore with persistence (client-side only)
let db: ReturnType<typeof getFirestore>

if (typeof window !== "undefined") {
  // Client-side initialization with persistence
  const firestoreInstance = getFirestore(firebaseApp)

  // Only attempt to enable persistence if we're in the browser
  // and if it hasn't been enabled before
  if (!(window as any).__FIRESTORE_PERSISTENCE_ENABLED__) {
    enableIndexedDbPersistence(firestoreInstance)
      .then(() => {
        console.log("Firebase persistence enabled successfully")
        // Mark persistence as enabled
        ;(window as any).__FIRESTORE_PERSISTENCE_ENABLED__ = true
      })
      .catch((err) => {
        if (err.code === "failed-precondition") {
          console.log("Firebase persistence failed: Multiple tabs open")
        } else if (err.code === "unimplemented") {
          console.log("Firebase persistence not supported in this browser")
        } else {
          console.error("Firebase persistence error:", err.code)
        }
      })
  }

  db = firestoreInstance
} else {
  // Server-side initialization (no persistence)
  db = getFirestore(firebaseApp)
}

const storage = getStorage(firebaseApp)

export { firebaseApp, auth, db, storage }
