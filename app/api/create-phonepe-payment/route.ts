import { NextResponse } from "next/server"
import { initiatePhonePePayment } from "@/lib/phonepe"

export async function POST(request: Request) {
  try {
    console.log("Payment creation request received")

    // Parse request body
    const body = await request.json()
    console.log("Request body:", body)

    // Validate request
    if (!body.name || !body.email || !body.phone) {
      console.error("Missing required fields in request")
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Fixed amount of ₹249
    const amount = 249
    console.log("Using fixed amount:", amount)

    // Initiate payment
    console.log("Initiating PhonePe payment")
    const result = await initiatePhonePePayment({
      amount: amount,
      userId: `USER_${Date.now()}`,
      productName: "Digital Product Package",
      mobile: body.phone,
      email: body.email,
    })

    console.log("PhonePe payment initiation result:", result)

    if (result.success && result.url) {
      return NextResponse.json({
        success: true,
        url: result.url,
        merchantTransactionId: result.merchantTransactionId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Payment initiation failed",
          code: result.code,
          rawResponse: result.rawResponse,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
