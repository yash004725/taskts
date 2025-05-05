import { NextResponse } from "next/server"

// This would be stored securely in environment variables
const CASHFREE_API_KEY = process.env.CASHFREE_API_KEY || ""
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || ""
const CASHFREE_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    // Verify payment status with Cashfree
    const response = await fetch(`${CASHFREE_API_URL}/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": CASHFREE_API_KEY,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Cashfree API error:", errorData)
      return NextResponse.json({ message: "Failed to verify payment status" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      status: "success",
      orderStatus: data.order_status,
      paymentDetails: data.payment_details || {},
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
