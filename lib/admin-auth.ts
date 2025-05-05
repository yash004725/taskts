import { auth, db } from "@/lib/firebase-config"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

// Admin authentication functions
export async function adminLogin(email: string, password: string) {
  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Check if user is an admin in Firestore
    const userDoc = await getDoc(doc(db, "admins", user.uid))

    if (!userDoc.exists()) {
      // Not an admin, sign out and throw error
      await signOut(auth)
      throw new Error("Access denied. You are not authorized as an admin.")
    }

    // Update last login timestamp
    await setDoc(
      doc(db, "admins", user.uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    )

    // Store admin session in localStorage
    localStorage.setItem("adminSession", "true")
    localStorage.setItem("adminUid", user.uid)

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userDoc.data().displayName || user.email,
      },
    }
  } catch (error: any) {
    console.error("Admin login error:", error)

    // Handle specific Firebase errors
    if (error.code === "auth/too-many-requests") {
      throw new Error("Too many login attempts. Please try again later.")
    } else if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      throw new Error("Invalid email or password.")
    }

    throw error
  }
}

export async function adminLogout() {
  try {
    // Sign out from Firebase
    await signOut(auth)

    // Clear admin session from localStorage
    localStorage.removeItem("adminSession")
    localStorage.removeItem("adminUid")

    return { success: true }
  } catch (error) {
    console.error("Admin logout error:", error)
    throw error
  }
}

export async function checkAdminStatus() {
  try {
    // Check if admin session exists in localStorage
    const isAdmin = localStorage.getItem("adminSession") === "true"
    const adminUid = localStorage.getItem("adminUid")

    if (!isAdmin || !adminUid) {
      return { isAdmin: false }
    }

    // Verify admin status in Firestore
    const userDoc = await getDoc(doc(db, "admins", adminUid))

    if (!userDoc.exists()) {
      // Not an admin, clear session
      localStorage.removeItem("adminSession")
      localStorage.removeItem("adminUid")
      return { isAdmin: false }
    }

    return {
      isAdmin: true,
      adminData: {
        uid: adminUid,
        email: userDoc.data().email,
        displayName: userDoc.data().displayName,
        role: userDoc.data().role || "admin",
      },
    }
  } catch (error) {
    console.error("Admin status check error:", error)
    return { isAdmin: false }
  }
}

// Function to create initial admin user (should be called only once during setup)
export async function setupInitialAdmin(email: string, password: string, displayName: string) {
  try {
    // Check if admin already exists
    const adminSnapshot = await getDoc(doc(db, "settings", "adminSetup"))

    if (adminSnapshot.exists() && adminSnapshot.data().initialized) {
      throw new Error("Admin already initialized. Cannot create another initial admin.")
    }

    // Create user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Set up admin in Firestore
    await setDoc(doc(db, "admins", user.uid), {
      email,
      displayName,
      role: "superadmin",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    })

    // Mark admin as initialized
    await setDoc(doc(db, "settings", "adminSetup"), {
      initialized: true,
      initialAdminUid: user.uid,
      createdAt: serverTimestamp(),
    })

    return {
      success: true,
      message: "Initial admin created successfully",
    }
  } catch (error) {
    console.error("Setup initial admin error:", error)
    throw error
  }
}

// Function to update admin credentials
export async function updateAdminCredentials(
  currentPassword: string,
  newEmail?: string,
  newPassword?: string,
  newDisplayName?: string,
) {
  try {
    const adminUid = localStorage.getItem("adminUid")

    if (!adminUid) {
      throw new Error("Not authenticated as admin")
    }

    // Get current admin email
    const adminDoc = await getDoc(doc(db, "admins", adminUid))

    if (!adminDoc.exists()) {
      throw new Error("Admin not found")
    }

    const currentEmail = adminDoc.data().email

    // Verify current password by signing in
    await signInWithEmailAndPassword(auth, currentEmail, currentPassword)

    // Update display name in Firestore if provided
    if (newDisplayName) {
      await setDoc(
        doc(db, "admins", adminUid),
        {
          displayName: newDisplayName,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    }

    // Update email if provided
    if (newEmail && newEmail !== currentEmail) {
      // Update email in Firebase Auth
      await auth.currentUser?.updateEmail(newEmail)

      // Update email in Firestore
      await setDoc(
        doc(db, "admins", adminUid),
        {
          email: newEmail,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    }

    // Update password if provided
    if (newPassword) {
      await auth.currentUser?.updatePassword(newPassword)
    }

    return {
      success: true,
      message: "Admin credentials updated successfully",
    }
  } catch (error: any) {
    console.error("Update admin credentials error:", error)

    if (error.code === "auth/wrong-password") {
      throw new Error("Current password is incorrect")
    }

    throw error
  }
}
