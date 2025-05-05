import { NextResponse } from "next/server"
import { initiatePhonePePayment } from "@/lib/phonepe"
import { db } from "@/lib/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    console.log("Starting PhonePe payment creation")

    const body = await request.json()
    console.log("Payment request body:", JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.productId || !body.amount || !body.productName) {
      console.error("Missing required fields in payment request")
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate a unique transaction ID
    const merchantTransactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
    console.log("Generated transaction ID:", merchantTransactionId)

    // Create a payment record in Firestore
    console.log("Creating payment record in Firestore")
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
    console.log("Created payment record with ID:", paymentRef.id)

    // Hardcode the base URL for callbacks
    const baseUrl = "https://xdigitalhub.vercel.app"
    console.log("Base URL for callbacks:", baseUrl)

    // Construct callback URLs exactly as PhonePe expects
    const redirectUrl = `${baseUrl}/payment/phonepe-callback?paymentId=${paymentRef.id}`
    const callbackUrl = `${baseUrl}/api/phonepe-webhook`

    console.log("Redirect URL:", redirectUrl)
    console.log("Callback URL:", callbackUrl)

    // Initiate payment with PhonePe - using only required fields
    console.log("Initiating PhonePe payment")
    const paymentResponse = await initiatePhonePePayment({
      merchantTransactionId,
      amount: body.amount,
      merchantUserId: body.userId || `GUEST_${Date.now()}`,
      redirectUrl,
      callbackUrl,
      mobileNumber: body.customerPhone,
      email: body.customerEmail,
    })

    console.log("PhonePe payment initiation response:", JSON.stringify(paymentResponse, null, 2))

    if (!paymentResponse.success) {
      console.error("Failed to initiate PhonePe payment:", paymentResponse.error)

      // Update payment record to reflect failure
      try {
        const paymentsRef = collection(db, "payments")
        await addDoc(paymentsRef, {
          paymentId: paymentRef.id,
          status: "FAILED",
          error: paymentResponse.error || "Unknown error",
          updatedAt: serverTimestamp(),
        })
      } catch (updateError) {
        console.error("Failed to update payment record:", updateError)
      }

      return NextResponse.json(
        {
          message: "Failed to initiate payment",
          error: paymentResponse.error,
          code: paymentResponse.code,
          rawResponse: paymentResponse.rawResponse,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Payment initiated successfully",
      paymentId: paymentRef.id,
      merchantTransactionId,
      paymentUrl: paymentResponse.paymentUrl,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
