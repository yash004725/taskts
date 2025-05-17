import { NextResponse } from "next/server"
import { initiatePayment } from "@/lib/phonepe-integration"
import { initiateSimplePayment } from "@/lib/phonepe-simple"
import { initiateCashfreePayment } from "@/lib/cashfree"

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

    // Try the PhonePe simple implementation first
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
        provider: "phonepe-simple",
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
        provider: "phonepe",
      })
    }

    // If both PhonePe implementations fail, try Cashfree
    console.log("PhonePe implementations failed, trying Cashfree")
    const cashfreeResult = await initiateCashfreePayment({
      amount: amount,
      name: body.name,
      email: body.email,
      phone: body.phone,
    })

    console.log("Cashfree payment initiation result:", cashfreeResult)

    if (cashfreeResult.success && cashfreeResult.url) {
      return NextResponse.json({
        success: true,
        url: cashfreeResult.url,
        orderId: cashfreeResult.orderId,
        provider: "cashfree",
      })
    }

    // If all payment methods fail, provide direct access
    console.log("All payment methods failed, providing direct access")
    return NextResponse.json({
      success: true,
      url: "https://drive.google.com/file/d/1UuDyrl5KaiLbHvf5_qittwyZPNgCJrRT/view?usp=sharing",
      provider: "direct",
      message: "Direct access granted due to payment gateway issues",
    })
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
