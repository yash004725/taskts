// Direct payment link generator
// This is a simple fallback that redirects to the success page

export async function createDirectPaymentLink(options: {
  amount: number
  name: string
  email: string
  phone: string
}) {
  try {
    // In a real implementation, you would save this information to your database
    console.log("Creating direct payment link for:", options)

    // Base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xdigitalhub.vercel.app"

    // Generate a success URL that will redirect to the success page
    const successUrl = `${baseUrl}/payment/success?provider=direct&success=true`

    return {
      success: true,
      url: successUrl,
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
