import { cookies } from "next/headers"
import { doc, getDoc } from "firebase/firestore"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin if it hasn't been initialized yet
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    })
  }

  return {
    auth: getAuth(),
  }
}

// Get the current user from the session cookie
export async function getServerUser() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")?.value

    if (!sessionCookie) {
      return null
    }

    const { auth } = initializeFirebaseAdmin()
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      displayName: decodedClaims.name,
    }
  } catch (error) {
    console.error("Error getting server user:", error)
    return null
  }
}

// Check if a user is an admin
export async function isUserAdmin(uid: string) {
  try {
    // Import dynamically to avoid server/client mismatch
    const { db } = await import("./firebase-config")

    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data().isAdmin === true
    }

    return false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
