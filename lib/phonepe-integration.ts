import crypto from "crypto"

// PhonePe credentials from the environment variables
const CLIENT_ID = "M22BELQSW340M"
const API_KEY = "5093c394-38c3-4002-9813-d5eb127f1eeb"
const SALT_KEY = "SU2504301822473977942947"
const SALT_INDEX = "1"

// Base URL for callbacks
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://xdigitalhub.vercel.app"

// Target URL to redirect after successful payment
const TARGET_URL = "https://drive.google.com/file/d/1UuDyrl5KaiLbHvf5_qittwyZPNgCJrRT/view?usp=sharing"

// API endpoints for production
const API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
const STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

// Function to generate SHA-256 hash
function generateSHA256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex")
}

// Function to initiate PhonePe payment
export async function initiatePayment(options: {
  amount: number
  name: string
  email: string
  phone: string
}) {
  try {
    console.log("Initiating PhonePe payment with options:", options)

    // Generate a unique transaction ID
    const merchantTransactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
    console.log("Generated transaction ID:", merchantTransactionId)

    // Convert amount to paise (multiply by 100)
    const amountInPaise = Math.round(options.amount * 100)
    console.log("Amount in paise:", amountInPaise)

    // Callback URLs
    const redirectUrl = `${BASE_URL}/payment/success?merchantTransactionId=${merchantTransactionId}`
    const callbackUrl = `${BASE_URL}/api/phonepe-webhook`
    console.log("Redirect URL:", redirectUrl)
    console.log("Callback URL:", callbackUrl)

    // Create payload object
    const payload = {
      merchantId: CLIENT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `USER_${Date.now()}`,
      amount: amountInPaise,
      redirectUrl: redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl: callbackUrl,
      mobileNumber: options.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Add optional fields if provided
    if (options.email) {
      payload.email = options.email
    }

    console.log("Payment payload:", JSON.stringify(payload, null, 2))

    // Convert payload to base64
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64")
    console.log("Base64 payload:", payloadBase64)

    // Generate checksum
    const string = payloadBase64 + "/pg/v1/pay" + SALT_KEY
    const sha256 = generateSHA256(string)
    const checksum = `${sha256}###${SALT_INDEX}`
    console.log("Generated checksum:", checksum)

    // Create request body
    const requestBody = {
      request: payloadBase64,
    }

    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    // Make API request
    console.log("Making API request to:", API_URL)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-API-KEY": API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
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
        merchantTransactionId: merchantTransactionId,
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

// Function to verify PhonePe payment
export async function verifyPayment(merchantTransactionId: string) {
  try {
    console.log("Verifying PhonePe payment for transaction ID:", merchantTransactionId)

    // Generate URL for status check
    const statusUrl = `${STATUS_URL}/${CLIENT_ID}/${merchantTransactionId}`
    console.log("Status URL:", statusUrl)

    // Generate checksum for verification
    const string = `/pg/v1/status/${CLIENT_ID}/${merchantTransactionId}${SALT_KEY}`
    const sha256 = generateSHA256(string)
    const checksum = `${sha256}###${SALT_INDEX}`
    console.log("Generated verification checksum:", checksum)

    // Make API request
    console.log("Making verification API request")
    const response = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-API-KEY": API_KEY,
        "X-MERCHANT-ID": CLIENT_ID,
        Accept: "application/json",
      },
    })

    // Log response status
    console.log("PhonePe verification API response status:", response.status)

    // Get response as text first for logging
    const responseText = await response.text()
    console.log("PhonePe verification API response text:", responseText)

    // Parse response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse PhonePe verification response as JSON:", e)
      return {
        success: false,
        paymentSuccess: false,
        error: "Invalid response from payment gateway",
        rawResponse: responseText,
      }
    }

    // Check for success
    if (data.success) {
      const paymentSuccess = data.code === "PAYMENT_SUCCESS"
      return {
        success: true,
        paymentSuccess: paymentSuccess,
        data: data.data,
        code: data.code,
        targetUrl: TARGET_URL,
      }
    } else {
      console.error("PhonePe payment verification failed:", data)
      return {
        success: false,
        paymentSuccess: false,
        error: data.message || "Payment verification failed",
        code: data.code,
        rawResponse: data,
      }
    }
  } catch (error) {
    console.error("PhonePe payment verification error:", error)
    return {
      success: false,
      paymentSuccess: false,
      error: error instanceof Error ? error.message : "An error occurred while verifying payment",
    }
  }
}

// Export the target URL for use in other files
export { TARGET_URL }
