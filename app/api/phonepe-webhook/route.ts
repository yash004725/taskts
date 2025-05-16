import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the webhook payload
    const body = await request.json()
    console.log("PhonePe webhook received:", JSON.stringify(body, null, 2))

    // Process the webhook data
    // Here you would typically update your database with payment status

    // Return success
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("PhonePe webhook error:", error)
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}
