import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore"
import { initializeApp, getApps } from "firebase/app"

// Your Firebase configuration
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
let app: any
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

export async function setupAdminUser() {
  try {
    const auth = getAuth()
    const db = getFirestore()

    // Create admin user
    const email = "yashkr2580@gmail.com"
    const password = "Yash@2580"

    // Check if user exists first to avoid errors
    try {
      // Try to sign in first to check if user exists
      try {
        await signInWithEmailAndPassword(auth, email, password)
        console.log("Admin user already exists and credentials are valid")

        // Check if admin role is set in Firestore
        const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid))
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          // Update admin privileges in Firestore
          await setDoc(
            doc(db, "users", auth.currentUser!.uid),
            {
              uid: auth.currentUser!.uid,
              email: email,
              displayName: "Admin User",
              isAdmin: true,
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          )
          console.log("Admin privileges updated")
        }

        return { success: true, message: "Admin user already exists" }
      } catch (signInError) {
        // User doesn't exist or password is incorrect, create new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Update profile
        await updateProfile(user, {
          displayName: "Admin User",
        })

        // Set admin privileges in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: email,
          displayName: "Admin User",
          isAdmin: true,
          createdAt: new Date().toISOString(),
        })

        console.log("Admin user created successfully")
        return { success: true, message: "Admin user created successfully" }
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        console.log("Admin user already exists but password may be incorrect")
        return { success: false, message: "Admin user exists but credentials may be incorrect" }
      }
      throw error
    }
  } catch (error) {
    console.error("Error setting up admin user:", error)
    return { success: false, error }
  }
}
