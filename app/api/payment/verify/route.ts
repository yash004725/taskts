import { NextResponse } from "next/server"
import { verifyPhonePePayment } from "@/lib/phonepe"
import { db } from "@/lib/firebase-config"
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const paymentId = url.searchParams.get("paymentId")
    const transactionId = url.searchParams.get("transactionId")

    if (!paymentId) {
      return NextResponse.json({ success: false, message: "Missing payment reference" }, { status: 400 })
    }

    // Get the payment details from Firestore
    const paymentDoc = await getDoc(doc(db, "payments", paymentId))

    if (!paymentDoc.exists()) {
      return NextResponse.json({ success: false, message: "Payment not found" }, { status: 404 })
    }

    const paymentData = paymentDoc.data()
    const merchantTransactionId = paymentData.merchantTransactionId

    // Verify with PhonePe API
    const verificationResult = await verifyPhonePePayment(merchantTransactionId)

    if (verificationResult.success && verificationResult.paymentSuccess) {
      // Update payment status in Firestore
      await updateDoc(doc(db, "payments", paymentId), {
        status: "COMPLETED",
        transactionId: transactionId || verificationResult.transactionId,
        updatedAt: serverTimestamp(),
      })

      // Create a purchase record
      const purchaseRef = await addDoc(collection(db, "purchases"), {
        userId: paymentData.userId,
        userEmail: paymentData.userEmail,
        productId: paymentData.productId,
        productName: paymentData.productName,
        amount: paymentData.amount,
        paymentId: paymentId,
        transactionId: transactionId || verificationResult.transactionId,
        purchaseDate: serverTimestamp(),
      })

      return NextResponse.json({
        success: true,
        paymentSuccess: true,
        message: "Payment verified successfully",
        orderDetails: {
          orderId: purchaseRef.id,
          amount: paymentData.amount,
          timestamp: Date.now(),
        },
      })
    } else {
      // Update payment status in Firestore
      await updateDoc(doc(db, "payments", paymentId), {
        status: "FAILED",
        updatedAt: serverTimestamp(),
      })

      return NextResponse.json({
        success: true,
        paymentSuccess: false,
        message: "Payment verification failed",
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
