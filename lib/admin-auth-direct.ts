// Direct admin authentication without Firebase - Client-side only
// Hardcoded admin credentials
const ADMIN_ID = "Yash2580"
const ADMIN_PASSWORD = "Yash@2580"

// Client-side admin authentication
export async function adminLogin(username: string, password: string) {
  try {
    // Check credentials against hardcoded values
    if (username === ADMIN_ID && password === ADMIN_PASSWORD) {
      // Create a simple session token (in a real app, use a more secure method)
      const sessionToken = btoa(
        JSON.stringify({
          id: ADMIN_ID,
          timestamp: Date.now(),
          role: "admin",
        }),
      )

      // Store admin session in localStorage
      localStorage.setItem("adminSession", sessionToken)

      return {
        success: true,
        user: {
          id: ADMIN_ID,
          role: "admin",
        },
      }
    } else {
      throw new Error("Invalid credentials")
    }
  } catch (error: any) {
    console.error("Admin login error:", error)
    throw new Error("Invalid username or password")
  }
}

export async function adminLogout() {
  try {
    // Clear admin session from localStorage
    localStorage.removeItem("adminSession")

    return { success: true }
  } catch (error) {
    console.error("Admin logout error:", error)
    throw error
  }
}

export async function checkAdminStatus() {
  try {
    // Check if admin session exists in localStorage
    const sessionToken = localStorage.getItem("adminSession")

    if (!sessionToken) {
      return { isAdmin: false }
    }

    try {
      // Decode and validate the session token
      const sessionData = JSON.parse(atob(sessionToken))

      // Check if the session is for the correct admin
      if (sessionData.id === ADMIN_ID) {
        return {
          isAdmin: true,
          adminData: {
            id: ADMIN_ID,
            role: "admin",
            displayName: "Admin User",
          },
        }
      }
    } catch (e) {
      // Invalid token format
      localStorage.removeItem("adminSession")
      return { isAdmin: false }
    }

    return { isAdmin: false }
  } catch (error) {
    console.error("Admin status check error:", error)
    return { isAdmin: false }
  }
}
