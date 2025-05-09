import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Log webhook data
    console.log("PhonePe webhook received:", JSON.stringify(body))

    // Process webhook data
    // Here you would typically update your database with payment status

    // Return success
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("PhonePe webhook error:", error)
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}
