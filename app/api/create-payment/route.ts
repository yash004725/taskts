import { NextResponse } from "next/server"
import { initiatePayment } from "@/lib/phonepe-integration"
import { initiateSimplePayment } from "@/lib/phonepe-simple"

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

    // Try the simple implementation first
    console.log("Initiating PhonePe payment with simple implementation")
    const simpleResult = await initiateSimplePayment({
      amount: amount,
      name: body.name,
      email: body.email,
      phone: body.phone,
    })

    console.log("PhonePe simple payment initiation result:", simpleResult)

    if (simpleResult.success && simpleResult.url) {
      return NextResponse.json({
        success: true,
        url: simpleResult.url,
        merchantTransactionId: simpleResult.merchantTransactionId,
      })
    }

    // If simple implementation fails, try the original implementation
    console.log("Simple implementation failed, trying original implementation")
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
      },
      { status: 500 },
    )
  }
}
