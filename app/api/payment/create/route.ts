import { NextResponse } from "next/server"
import { initiatePhonePePayment } from "@/lib/phonepe"
import { db } from "@/lib/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.amount || !body.productName) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Generate a unique transaction ID
    const merchantTransactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

    // Create a payment record in Firestore
    const paymentRef = await addDoc(collection(db, "payments"), {
      userId: body.userId || "guest",
      userEmail: body.customerEmail || "guest@example.com",
      productId: body.productId,
      productName: body.productName,
      amount: body.amount,
      merchantTransactionId,
      status: "INITIATED",
      gateway: "PhonePe",
      customerName: body.customerName || "",
      customerPhone: body.customerPhone || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Get the base URL for callbacks
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://xdigitalhub.vercel.app/
")

    console.log("Base URL for callbacks:", baseUrl)

    // Initiate payment with PhonePe
    const paymentResponse = await initiatePhonePePayment({
      merchantTransactionId,
      amount: body.amount,
      merchantUserId: body.userId || "guest",
      redirectUrl: `${baseUrl}/payment/callback?paymentId=${paymentRef.id}`,
      callbackUrl: `${baseUrl}/api/payment/webhook`,
      productInfo: body.productName,
      mobileNumber: body.customerPhone,
      email: body.customerEmail,
    })

    console.log("PhonePe payment response:", paymentResponse)

    if (!paymentResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initiate payment",
          error: paymentResponse.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Payment initiated successfully",
      paymentId: paymentRef.id,
      merchantTransactionId,
      paymentUrl: paymentResponse.paymentUrl,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
