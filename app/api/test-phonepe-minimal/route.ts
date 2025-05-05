import { NextResponse } from "next/server"
import crypto from "crypto"

// PhonePe API key
const API_KEY = "5093c394-38c3-4002-9813-d5eb127f1eeb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const amount = body.amount || 1 // Default to 1 rupee if not specified

    // Get merchant credentials from environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID
    const saltKey = process.env.PHONEPE_SALT_KEY
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1"

    // Validate credentials
    if (!merchantId || !saltKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing merchant credentials. Please check your environment variables.",
        },
        { status: 400 },
      )
    }

    // Generate a unique transaction ID
    const merchantTransactionId = `TEST_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

    // Base URL for callbacks
    const baseUrl = "https://xdigitalhub.vercel.app"
    const redirectUrl = `${baseUrl}/payment/phonepe-callback?test=true`
    const callbackUrl = `${baseUrl}/api/phonepe-webhook`

    // Create a minimal payload
    const payload = {
      merchantId,
      merchantTransactionId,
      amount: amount * 100, // Convert to paise
      redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl,
      merchantUserId: `TEST_USER_${Date.now()}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Convert payload to base64
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64")

    // Generate checksum
    const string = payloadBase64 + "/pg/v1/pay" + saltKey
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    const checksum = `${sha256}###${saltIndex}`

    // Make API request to PhonePe
    const apiUrl = "https://api.phonepe.com/apis/hermes/pg/v1/pay"

    // Create request body
    const requestBody = {
      request: payloadBase64,
    }

    // Make the API call
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        Accept: "application/json",
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify(requestBody),
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

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || data.error || `API error: ${response.status}`,
          code: data.code,
          rawResponse: data,
        },
        { status: response.status },
      )
    }

    // Check for specific error codes in the response
    if (data.code !== "PAYMENT_INITIATED" && data.code !== "SUCCESS") {
      return NextResponse.json(
        {
          success: false,
          error: data.message || `Payment not initiated: ${data.code}`,
          code: data.code,
          rawResponse: data,
        },
        { status: 400 },
      )
    }

    // Ensure the redirect URL is present
    if (!data.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment gateway did not return a redirect URL",
          rawResponse: data,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      paymentUrl: data.data.instrumentResponse.redirectInfo.url,
      merchantTransactionId,
      rawResponse: data,
    })
  } catch (error) {
    console.error("Test payment error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
