import { NextResponse } from "next/server"
import { initiatePayment } from "@/lib/phonepe-simple"

export async function POST(request: Request) {
  try {
    console.log("Simple payment request received")

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
    const result = await initiatePayment({
      amount: amount,
      name: body.name,
      email: body.email,
      phone: body.phone,
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
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
