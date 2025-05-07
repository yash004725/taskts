import crypto from "crypto"

// Simple function to generate SHA-256 hash
function generateSHA256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex")
}

// Simple function to initiate payment
export async function initiatePayment(options: {
  amount: number
  name: string
  email: string
  phone: string
}) {
  try {
    // Get credentials from environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT"
    const saltKey = "5093c394-38c3-4002-9813-d5eb127f1eeb" // Using the provided salt key
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1"
    const apiKey = "5093c394-38c3-4002-9813-d5eb127f1eeb" // Using the provided API key

    // Generate transaction ID
    const txnId = `TXN_${Date.now()}`

    // Create payload
    const payload = {
      merchantId: merchantId,
      merchantTransactionId: txnId,
      amount: options.amount * 100,
      redirectUrl: "https://xdigitalhub.vercel.app/payment/callback",
      redirectMode: "REDIRECT",
      callbackUrl: "https://xdigitalhub.vercel.app/api/webhook",
      merchantUserId: `USER_${Date.now()}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Convert to base64
    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64")

    // Generate checksum
    const string = base64 + "/pg/v1/pay" + saltKey
    const sha256 = generateSHA256(string)
    const checksum = `${sha256}###${saltIndex}`

    // Create request
    const url = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      Accept: "application/json",
      "X-API-KEY": apiKey,
    }

    const body = JSON.stringify({
      request: base64,
    })

    // Make request
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })

    // Parse response
    const text = await response.text()
    let data

    try {
      data = JSON.parse(text)
    } catch (e) {
      return {
        success: false,
        error: "Invalid response",
      }
    }

    // Check for success
    if (!response.ok) {
      return {
        success: false,
        error: `API error: ${response.status}`,
      }
    }

    // Return payment URL
    if (data.data?.instrumentResponse?.redirectInfo?.url) {
      return {
        success: true,
        url: data.data.instrumentResponse.redirectInfo.url,
      }
    } else {
      return {
        success: false,
        error: "No redirect URL",
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "Payment error",
    }
  }
}
