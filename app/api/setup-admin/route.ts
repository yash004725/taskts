import { NextResponse } from "next/server"
import { setupAdminUser } from "@/lib/admin-setup"

export async function GET() {
  try {
    // This endpoint should be secured in production
    // For now, it's open for initial setup
    const result = await setupAdminUser()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Admin user setup completed",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to set up admin user",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in setup-admin route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error during admin setup",
      },
      { status: 500 },
    )
  }
}
