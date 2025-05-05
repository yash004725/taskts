import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-config"
import { doc, updateDoc, serverTimestamp, collection, addDoc, query, where, getDocs } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("PhonePe webhook payload:", JSON.stringify(body, null, 2))

    // Extract the merchantTransactionId from the webhook payload
    const merchantTransactionId = body.data?.merchantTransactionId || body.merchantTransactionId

    if (!merchantTransactionId) {
      console.error("Invalid webhook payload: Missing merchantTransactionId")
      return NextResponse.json({ status: "error", message: "Invalid payload" }, { status: 400 })
    }

    // Find the payment in Firestore by merchantTransactionId
    const paymentsRef = collection(db, "payments")
    const q = query(paymentsRef, where("merchantTransactionId", "==", merchantTransactionId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.error(`Payment not found for merchantTransactionId: ${merchantTransactionId}`)
      return NextResponse.json({ status: "error", message: "Payment not found" }, { status: 404 })
    }

    const paymentDoc = querySnapshot.docs[0]
    const paymentId = paymentDoc.id
    const paymentData = paymentDoc.data()

    // Determine payment status from webhook
    const paymentSuccess =
      body.code === "PAYMENT_SUCCESS" ||
      (body.data && body.data.responseCode === "SUCCESS") ||
      body.status === "SUCCESS"

    if (paymentSuccess) {
      // Update payment status in Firestore
      await updateDoc(doc(db, "payments", paymentId), {
        status: "SUCCESS",
        transactionId: body.data?.transactionId || body.transactionId || "",
        paymentState: body.data?.state || body.state || "",
        responseCode: body.data?.responseCode || body.responseCode || "",
        webhookReceived: true,
        webhookData: body,
        updatedAt: serverTimestamp(),
      })

      // Create order in Firestore
      await addDoc(collection(db, "orders"), {
        paymentId,
        merchantTransactionId,
        transactionId: body.data?.transactionId || body.transactionId || "",
        productId: paymentData.productId,
        productName: paymentData.productName,
        amount: paymentData.amount,
        customerName: paymentData.customerName,
        customerEmail: paymentData.userEmail,
        customerPhone: paymentData.customerPhone,
        status: "COMPLETED",
        createdAt: serverTimestamp(),
      })
    } else {
      // Update payment status in Firestore for failed payment
      await updateDoc(doc(db, "payments", paymentId), {
        status: "FAILED",
        paymentState: body.data?.state || body.state || "",
        responseCode: body.data?.responseCode || body.responseCode || "",
        webhookReceived: true,
        webhookData: body,
        updatedAt: serverTimestamp(),
      })
    }

    // Return success response to PhonePe
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
