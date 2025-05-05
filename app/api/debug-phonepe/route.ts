import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET(request: Request) {
  try {
    // Get environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID || "MISSING"
    const saltKey = process.env.PHONEPE_SALT_KEY || "MISSING"
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "MISSING"
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xdigitalhub.vercel.app"

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
      apiKey: "5093c394-38c3-4002-9813-d5eb127f1eeb", // The API key you provided
      mode: "PRODUCTION", // We're using production mode
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Failed to generate debug information" }, { status: 500 })
  }
}
