// Cashfree payment gateway integration

export interface PaymentOrderRequest {
  orderId: string
  orderAmount: number
  orderCurrency: string
  customerName: string
  customerEmail: string
  customerPhone: string
  returnUrl: string
  notifyUrl?: string
  orderNote?: string
}

export interface PaymentOrderResponse {
  status: string
  message: string
  cfOrderId: string
  paymentLink: string
}

// Function to create a payment order with Cashfree
export async function createPaymentOrder(paymentData: PaymentOrderRequest): Promise<PaymentOrderResponse> {
  try {
    // In production, this should be an API call to your backend
    // which then makes a secure request to Cashfree with your API keys
    const response = await fetch("/api/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create payment order")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error creating payment order:", error)
    throw new Error(error.message || "Failed to create payment order")
  }
}

// Function to verify payment status
export async function verifyPaymentStatus(orderId: string): Promise<any> {
  try {
    const response = await fetch(`/api/verify-payment?orderId=${orderId}`, {
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to verify payment")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error verifying payment:", error)
    throw new Error(error.message || "Failed to verify payment status")
  }
}
