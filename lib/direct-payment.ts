// Direct payment link generator
// This is a simple fallback that creates a direct link to Google Drive

export async function createDirectPaymentLink(options: {
  amount: number
  name: string
  email: string
  phone: string
}) {
  try {
    // In a real implementation, you would save this information to your database
    console.log("Creating direct payment link for:", options)

    // The Google Drive link to redirect to
    const driveLink = "https://drive.google.com/file/d/1UuDyrl5KaiLbHvf5_qittwyZPNgCJrRT/view?usp=sharing"

    // For demonstration purposes, we're just returning the drive link directly
    // In a real implementation, you would create a payment record and generate a unique link
    return {
      success: true,
      url: driveLink,
      message: "Direct access granted",
    }
  } catch (error) {
    console.error("Direct payment link error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while creating direct payment link",
    }
  }
}
