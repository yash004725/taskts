import { NextResponse } from "next/server"
import { verifyPhonePePayment } from "@/lib/phonepe"

export async function GET(request: Request) {
  try {
    console.log("Payment verification request received")

    // Get merchantTransactionId from query parameters
    const url = new URL(request.url)
    const merchantTransactionId = url.searchParams.get("merchantTransactionId")
    console.log("merchantTransactionId:", merchantTransactionId)

    if (!merchantTransactionId) {
      console.error("Missing merchantTransactionId in request")
      return NextResponse.json(
        {
          success: false,
          error: "Missing merchantTransactionId",
        },
        { status: 400 },
      )
    }

    // Verify payment
    console.log("Verifying payment with PhonePe")
    const result = await verifyPhonePePayment(merchantTransactionId)
    console.log("Verification result:", result)

    return NextResponse.json({
      success: result.success,
      paymentSuccess: result.paymentSuccess,
      data: result.data,
      code: result.code,
      error: result.error,
    })
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
