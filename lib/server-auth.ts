import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Initialize Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
}

// Initialize the Firebase Admin app
const app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0]

/**
 * Get the current user from the server
 */
export async function getServerUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("session")?.value

    if (!token) return null

    // Verify the session cookie and get the user
    const decodedToken = await getAuth(app).verifySessionCookie(token, true)
    const user = await getAuth(app).getUser(decodedToken.uid)

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
  } catch (error) {
    console.error("Error getting server user:", error)
    return null
  }
}
