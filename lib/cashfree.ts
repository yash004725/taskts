// Cashfree payment integration

export async function initiateCashfreePayment(options: {
  amount: number
  name: string
  email: string
  phone: string
}) {
  try {
    // Get credentials from environment variables
    const apiKey = process.env.CASHFREE_API_KEY
    const secretKey = process.env.CASHFREE_SECRET_KEY

    // Check if credentials are available
    if (!apiKey || !secretKey) {
      console.error("Cashfree credentials not found")
      return {
        success: false,
        error: "Payment gateway credentials not configured",
      }
    }

    // Base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xdigitalhub.vercel.app"

    // Generate order ID
    const orderId = `ORDER_${Date.now()}`

    // Create request
    const url = "https://sandbox.cashfree.com/pg/orders"

    const payload = {
      order_id: orderId,
      order_amount: options.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_name: options.name,
        customer_email: options.email,
        customer_phone: options.phone,
      },
      order_meta: {
        return_url: `${baseUrl}/payment/success?orderId=${orderId}&status=${encodeURIComponent("{status}")}`,
      },
    }

    console.log("Cashfree payload:", JSON.stringify(payload, null, 2))

    // Make request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": apiKey,
        "x-client-secret": secretKey,
      },
      body: JSON.stringify(payload),
    })

    // Get response
    const data = await response.json()
    console.log("Cashfree response:", data)

    if (data.payment_link) {
      return {
        success: true,
        url: data.payment_link,
        orderId: orderId,
      }
    } else {
      return {
        success: false,
        error: data.message || "Failed to create payment",
        rawResponse: data,
      }
    }
  } catch (error) {
    console.error("Cashfree payment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while processing payment",
    }
  }
}
