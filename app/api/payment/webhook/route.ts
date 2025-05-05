import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-config"
import { doc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("PhonePe webhook payload:", JSON.stringify(body, null, 2))

    // Extract transaction details from the webhook payload
    const merchantTransactionId = body.data?.merchantTransactionId
    const transactionId = body.data?.transactionId
    const amount = body.data?.amount ? body.data.amount / 100 : 0 // Convert from paise to rupees
    const paymentSuccess = body.code === "PAYMENT_SUCCESS" || (body.data && body.data.responseCode === "SUCCESS")

    if (!merchantTransactionId) {
      return NextResponse.json({ success: false, message: "Invalid webhook payload" }, { status: 400 })
    }

    // Find the payment in Firestore by merchantTransactionId
    const paymentsSnapshot = await db
      .collection("payments")
      .where("merchantTransactionId", "==", merchantTransactionId)
      .limit(1)
      .get()

    if (paymentsSnapshot.empty) {
      return NextResponse.json({ success: false, message: "Payment not found" }, { status: 404 })
    }

    const paymentDoc = paymentsSnapshot.docs[0]
    const paymentData = paymentDoc.data()
    const paymentId = paymentDoc.id

    if (paymentSuccess) {
      // Update payment status in Firestore
      await updateDoc(doc(db, "payments", paymentId), {
        status: "COMPLETED",
        transactionId: transactionId,
        updatedAt: serverTimestamp(),
      })

      // Create a purchase record
      await addDoc(collection(db, "purchases"), {
        userId: paymentData.userId,
        userEmail: paymentData.userEmail,
        productId: paymentData.productId,
        productName: paymentData.productName,
        amount: paymentData.amount,
        paymentId: paymentId,
        transactionId: transactionId,
        purchaseDate: serverTimestamp(),
      })
    } else {
      // Update payment status in Firestore
      await updateDoc(doc(db, "payments", paymentId), {
        status: "FAILED",
        updatedAt: serverTimestamp(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
