import { NextResponse } from "next/server"
import { initiatePayment } from "@/lib/phonepe-simple"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await initiatePayment({
      amount: body.amount || 249,
      name: body.name || "Guest",
      email: body.email || "guest@example.com",
      phone: body.phone || "9876543210",
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
