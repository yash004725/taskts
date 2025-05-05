// PhonePe Integration Service
import crypto from "crypto"

// PhonePe merchant credentials
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || ""
const SALT_KEY = process.env.PHONEPE_SALT_KEY || ""
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1"
const API_KEY = "5093c394-38c3-4002-9813-d5eb127f1eeb" // Production API key

// Use production endpoints since this is a real API key
const USE_PRODUCTION = true

// API endpoints
const TEST_API_URL = "https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay"
const TEST_STATUS_URL = "https://api-preprod.phonepe.com/apis/hermes/pg/v1/status"
const PROD_API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
const PROD_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

// Get the actual URLs based on environment
const getApiUrl = () => (USE_PRODUCTION ? PROD_API_URL : TEST_API_URL)
const getStatusUrl = () => (USE_PRODUCTION ? PROD_STATUS_URL : TEST_STATUS_URL)

// Base URL for callbacks
const BASE_URL = "https://xdigitalhub.vercel.app"

export interface PhonePePaymentOptions {
  merchantTransactionId: string
  amount: number
  merchantUserId: string
  redirectUrl: string
  callbackUrl: string
  mobileNumber?: string
  email?: string
}

// Function to generate SHA-256 hash
function generateSHA256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex")
}

export async function initiatePhonePePayment(options: PhonePePaymentOptions) {
  try {
    console.log("Starting PhonePe payment initiation with options:", JSON.stringify(options, null, 2))

    // Validate credentials
    if (!MERCHANT_ID) {
      console.error("Missing PHONEPE_MERCHANT_ID environment variable")
      return {
        success: false,
        error: "Missing merchant ID. Please check your environment variables.",
      }
    }

    if (!SALT_KEY) {
      console.error("Missing PHONEPE_SALT_KEY environment variable")
      return {
        success: false,
        error: "Missing salt key. Please check your environment variables.",
      }
    }

    console.log("Using merchant ID:", MERCHANT_ID)
    console.log("Using API URL:", getApiUrl())
    console.log("Using production mode:", USE_PRODUCTION ? "Yes" : "No")

    const { merchantTransactionId, amount, merchantUserId, redirectUrl, callbackUrl, mobileNumber, email } = options

    // Convert amount to paise (multiply by 100) and ensure it's an integer
    const amountInPaise = Math.round(amount * 100)

    // Create payload according to PhonePe's documentation
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      amount: amountInPaise,
      redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl,
      merchantUserId,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Add optional fields if provided
    const fullPayload = { ...payload }
    if (mobileNumber) {
      fullPayload.mobileNumber = mobileNumber
    }
    if (email) {
      fullPayload.email = email
    }

    console.log("PhonePe payload:", JSON.stringify(fullPayload, null, 2))

    // Convert payload to base64
    const payloadString = JSON.stringify(fullPayload)
    const payloadBase64 = Buffer.from(payloadString).toString("base64")
    console.log("Payload Base64:", payloadBase64)

    // Generate checksum - EXACTLY as per PhonePe documentation
    const string = payloadBase64 + "/pg/v1/pay" + SALT_KEY
    console.log("String for checksum:", string)

    const sha256 = generateSHA256(string)
    console.log("Generated SHA256:", sha256)

    const checksum = `${sha256}###${SALT_INDEX}`
    console.log("Final checksum:", checksum)

    // Make API request to PhonePe
    console.log("Making request to PhonePe API:", getApiUrl())

    // Create the request body exactly as specified in PhonePe docs
    const requestBody = {
      request: payloadBase64,
    }

    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    // Make the API call with proper headers
    // Note: PhonePe API expects specific headers in a specific format
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      Accept: "application/json",
    }

    // Only add API key if we're using production mode
    if (USE_PRODUCTION) {
      headers["X-API-KEY"] = API_KEY
    }

    console.log("Request headers:", JSON.stringify(headers, null, 2))

    const response = await fetch(getApiUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    console.log("PhonePe API response status:", response.status)

    // Get response as text first for logging
    const responseText = await response.text()
    console.log("PhonePe API response text:", responseText)

    // Parse the response as JSON
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

    console.log("PhonePe API response data:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error("PhonePe API returned error status:", response.status)
      return {
        success: false,
        error: data.message || data.error || `API error: ${response.status}`,
        code: data.code,
        rawResponse: data,
      }
    }

    // Check for specific error codes in the response
    if (data.code !== "PAYMENT_INITIATED" && data.code !== "SUCCESS") {
      console.error("PhonePe payment not initiated:", data.code, data.message)
      return {
        success: false,
        error: data.message || `Payment not initiated: ${data.code}`,
        code: data.code,
        rawResponse: data,
      }
    }

    // Ensure the redirect URL is present
    if (!data.data?.instrumentResponse?.redirectInfo?.url) {
      console.error("PhonePe response missing redirect URL:", data)
      return {
        success: false,
        error: "Payment gateway did not return a redirect URL",
        rawResponse: data,
      }
    }

    return {
      success: true,
      paymentUrl: data.data.instrumentResponse.redirectInfo.url,
      merchantTransactionId,
      rawResponse: data,
    }
  } catch (error) {
    console.error("PhonePe payment initiation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function verifyPhonePePayment(merchantTransactionId: string) {
  try {
    console.log("Starting PhonePe payment verification for transaction:", merchantTransactionId)

    // Validate credentials
    if (!MERCHANT_ID || !SALT_KEY) {
      console.error("Missing PhonePe merchant credentials")
      return {
        success: false,
        paymentSuccess: false,
        error: "Missing merchant credentials. Please check your environment variables.",
      }
    }

    const checkUrl = `${getStatusUrl()}/${MERCHANT_ID}/${merchantTransactionId}`

    // Generate checksum for verification
    const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${SALT_KEY}`
    const sha256 = generateSHA256(string)
    const checksum = `${sha256}###${SALT_INDEX}`

    console.log("PhonePe verification URL:", checkUrl)
    console.log("String for verification checksum:", string)
    console.log("PhonePe verification checksum:", checksum)

    // Prepare headers for verification request
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      Accept: "application/json",
    }

    // Only add API key if we're using production mode
    if (USE_PRODUCTION) {
      headers["X-API-KEY"] = API_KEY
    }

    const response = await fetch(checkUrl, {
      method: "GET",
      headers,
    })

    console.log("PhonePe verification response status:", response.status)

    // Get response as text first for logging
    const responseText = await response.text()
    console.log("PhonePe verification response text:", responseText)

    // Parse the response as JSON
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

    console.log("PhonePe verification response data:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error("PhonePe verification API returned error status:", response.status)
      return {
        success: false,
        paymentSuccess: false,
        error: data.message || `API error: ${response.status}`,
        rawResponse: data,
      }
    }

    // Check payment status
    const paymentSuccess = data.code === "PAYMENT_SUCCESS" || (data.data && data.data.responseCode === "SUCCESS")

    return {
      success: true,
      paymentSuccess,
      transactionId: data.data?.transactionId || "",
      amount: data.data?.amount ? data.data.amount / 100 : 0, // Convert from paise to rupees
      paymentState: data.data?.state || "",
      responseCode: data.data?.responseCode || "",
      rawResponse: data,
    }
  } catch (error) {
    console.error("PhonePe payment verification error:", error)
    return {
      success: false,
      paymentSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
