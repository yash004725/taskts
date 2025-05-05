import { NextResponse } from "next/server"
import crypto from "crypto"

// This is a direct test of the PhonePe API with an absolute minimal approach
export async function GET() {
  try {
    // Only enable in development mode
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ message: "Test endpoint disabled in production" }, { status: 403 })
    }

    // PhonePe merchant credentials
    const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || ""
    const SALT_KEY = process.env.PHONEPE_SALT_KEY || ""
    const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1"
    const TEST_API_URL = "https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay"

    // Check if credentials are set
    if (!MERCHANT_ID || !SALT_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing PhonePe credentials. Please check your environment variables.",
        },
        { status: 400 },
      )
    }

    // Generate a unique transaction ID
    const merchantTransactionId = `TEST_${Date.now()}`

    // Base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xdigitalhub.vercel.app"

    // Create a minimal payload - absolute bare minimum
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      amount: 100, // 1 rupee in paise
      redirectUrl: `${baseUrl}/payment/phonepe-callback`,
      redirectMode: "REDIRECT",
      callbackUrl: `${baseUrl}/api/phonepe-webhook`,
      merchantUserId: `TEST_USER`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Convert payload to base64
    const payloadString = JSON.stringify(payload)
    const payloadBase64 = Buffer.from(payloadString).toString("base64")

    // Generate checksum
    const string = payloadBase64 + "/pg/v1/pay" + SALT_KEY
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    const checksum = `${sha256}###${SALT_INDEX}`

    // Make API request to PhonePe with minimal headers
    const response = await fetch(TEST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        Accept: "application/json",
      },
      body: JSON.stringify({
        request: payloadBase64,
      }),
    })

    // Get response as text first for logging
    const responseText = await response.text()

    // Parse the response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid response from payment gateway",
          rawResponse: responseText,
        },
        { status: 500 },
      )
    }

    // Return the complete test results
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      payload,
      payloadBase64,
      checksum,
      response: data,
      merchantTransactionId,
      paymentUrl: data.data?.instrumentResponse?.redirectInfo?.url || null,
    })
  } catch (error) {
    console.error("Minimal PhonePe test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
