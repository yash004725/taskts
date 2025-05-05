import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET(request: Request) {
  try {
    // Get environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID || "MISSING"
    const saltKey = process.env.PHONEPE_SALT_KEY || "MISSING"
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "MISSING"
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xdigitalhub.vercel.app"
    const apiKey = "5093c394-38c3-4002-9813-d5eb127f1eeb"

    // Test checksum generation
    const testPayload = {
      merchantId: merchantId,
      merchantTransactionId: "TEST_TXN_123",
      amount: 10000, // 100 rupees in paise
      redirectUrl: `${appUrl}/payment/callback`,
      redirectMode: "REDIRECT",
      callbackUrl: `${appUrl}/api/phonepe-webhook`,
      merchantUserId: "GUEST_123",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Convert payload to base64
    const payloadString = JSON.stringify(testPayload)
    const payloadBase64 = Buffer.from(payloadString).toString("base64")

    // Generate checksum
    const string = payloadBase64 + "/pg/v1/pay" + saltKey
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    const checksum = `${sha256}###${saltIndex}`

    // Test API call with minimal request
    let testApiResponse = "Not tested"
    let testApiStatus = "Not tested"

    try {
      // Only test if we have all required credentials
      if (merchantId !== "MISSING" && saltKey !== "MISSING") {
        const testUrl = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        const testBody = {
          request: payloadBase64,
        }

        const headers = {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          Accept: "application/json",
          "X-API-KEY": apiKey,
        }

        const response = await fetch(testUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(testBody),
        })

        testApiStatus = response.status.toString()
        testApiResponse = await response.text()
      }
    } catch (error) {
      testApiResponse = `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    }

    return NextResponse.json({
      environment: {
        merchantId: merchantId === "MISSING" ? "❌ Missing" : "✅ Set",
        saltKey: saltKey === "MISSING" ? "❌ Missing" : "✅ Set",
        saltIndex: saltIndex === "MISSING" ? "❌ Missing" : "✅ Set",
        appUrl,
      },
      testChecksum: {
        payloadBase64: payloadBase64.substring(0, 50) + "...", // Truncate for security
        checksumString: string.substring(0, 50) + "...", // Truncate for security
        sha256: sha256,
        checksum,
      },
      apiKey: apiKey,
      mode: "PRODUCTION",
      testApiCall: {
        status: testApiStatus,
        response: testApiResponse,
      },
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        Accept: "application/json",
        "X-API-KEY": apiKey,
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Failed to generate debug information" }, { status: 500 })
  }
}
