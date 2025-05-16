import { NextResponse } from "next/server"
import { verifyPayment } from "@/lib/phonepe-integration"

export async function GET(request: Request) {
  try {
    // Get the merchantTransactionId from the URL
    const url = new URL(request.url)
    const merchantTransactionId = url.searchParams.get("merchantTransactionId")

    console.log("Verifying payment for merchantTransactionId:", merchantTransactionId)

    if (!merchantTransactionId) {
      console.error("Missing merchantTransactionId in request")
      return NextResponse.json(
        {
          success: false,
          error: "Missing transaction ID",
        },
        { status: 400 },
      )
    }

    // Verify payment
    console.log("Calling verifyPayment")
    const result = await verifyPayment(merchantTransactionId)
    console.log("Verification result:", result)

    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentSuccess: result.paymentSuccess,
        data: result.data,
        code: result.code,
        targetUrl: result.targetUrl,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          paymentSuccess: false,
          error: result.error || "Payment verification failed",
          code: result.code,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment verification API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
