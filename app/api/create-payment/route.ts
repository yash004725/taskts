import { NextResponse } from "next/server"

// This would be stored securely in environment variables
const CASHFREE_API_KEY = process.env.CASHFREE_API_KEY || ""
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || ""
const CASHFREE_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.orderId ||
      !body.orderAmount ||
      !body.orderCurrency ||
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone ||
      !body.returnUrl
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create a payment order with Cashfree
    const response = await fetch(CASHFREE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": CASHFREE_API_KEY,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: body.orderId,
        order_amount: body.orderAmount,
        order_currency: body.orderCurrency,
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_name: body.customerName,
          customer_email: body.customerEmail,
          customer_phone: body.customerPhone,
        },
        order_meta: {
          return_url: body.returnUrl,
          notify_url: body.notifyUrl || "",
          payment_methods: "",
        },
        order_note: body.orderNote || "",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Cashfree API error:", errorData)
      return NextResponse.json({ message: "Failed to create payment order" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      status: "success",
      message: "Payment order created successfully",
      cfOrderId: data.cf_order_id,
      paymentLink: data.payment_link,
    })
  } catch (error) {
    console.error("Error creating payment order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
