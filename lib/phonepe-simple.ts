import crypto from "crypto"

// Function to generate SHA-256 hash
function generateSHA256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex")
}

// Simple function to initiate payment
export async function initiateSimplePayment(options: {
  amount: number
  name: string
  email: string
  phone: string
}) {
  try {
    // PhonePe merchant credentials from environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID || "M22BELQSW340M"
    const apiKey = process.env.PHONEPE_API_KEY || "5093c394-38c3-4002-9813-d5eb127f1eeb"
    const saltKey = process.env.PHONEPE_SALT_KEY || "SU2504301822473977942947"
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1"

    // Base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xdigitalhub.vercel.app"

    // Generate transaction ID
    const txnId = `TXN_${Date.now()}`

    // Convert amount to paise (multiply by 100)
    const amountInPaise = Math.round(options.amount * 100)

    // Create payload
    const payload = {
      merchantId: merchantId,
      merchantTransactionId: txnId,
      merchantUserId: `USER_${Date.now()}`,
      amount: amountInPaise,
      redirectUrl: `${baseUrl}/payment/success?merchantTransactionId=${txnId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${baseUrl}/api/phonepe-webhook`,
      mobileNumber: options.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Add email if provided
    if (options.email) {
      payload.email = options.email
    }

    console.log("Payment payload:", JSON.stringify(payload, null, 2))

    // Convert to base64
    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64")
    console.log("Base64 payload:", base64)

    // Generate checksum
    const string = base64 + "/pg/v1/pay" + saltKey
    const sha256 = generateSHA256(string)
    const checksum = `${sha256}###${saltIndex}`
    console.log("Generated checksum:", checksum)

    // Create request
    // Use production endpoint
    const url = "https://api.phonepe.com/apis/hermes/pg/v1/pay"

    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-API-KEY": apiKey,
      Accept: "application/json",
    }

    const body = JSON.stringify({
      request: base64,
    })

    console.log("Request URL:", url)
    console.log("Request headers:", headers)
    console.log("Request body:", body)

    // Make request
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })

    // Log response status
    console.log("PhonePe API response status:", response.status)

    // Get response as text first for logging
    const responseText = await response.text()
    console.log("PhonePe API response text:", responseText)

    // Parse response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse PhonePe response as JSON:", e)
      return {
        success: false,
        error: "Invalid response from payment gateway",
        rawResponse: responseText,
      }
    }

    // Check for success
    if (data.success && data.code === "PAYMENT_INITIATED") {
      // Extract payment URL
      const paymentUrl = data.data?.instrumentResponse?.redirectInfo?.url
      if (!paymentUrl) {
        console.error("Payment URL not found in response:", data)
        return {
          success: false,
          error: "Payment URL not found in response",
          rawResponse: data,
        }
      }

      return {
        success: true,
        url: paymentUrl,
        merchantTransactionId: txnId,
      }
    } else {
      console.error("PhonePe payment initiation failed:", data)
      return {
        success: false,
        error: data.message || data.error || "Payment initiation failed",
        code: data.code,
        rawResponse: data,
      }
    }
  } catch (error) {
    console.error("PhonePe payment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while processing payment",
    }
  }
}

// For backward compatibility
export const initiatePayment = initiateSimplePayment
