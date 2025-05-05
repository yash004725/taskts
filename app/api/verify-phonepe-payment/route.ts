import { NextResponse } from "next/server"
import { verifyPhonePePayment } from "@/lib/phonepe"
import { db } from "@/lib/firebase-config"
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const paymentId = url.searchParams.get("paymentId")

    if (!paymentId) {
      return NextResponse.json({ success: false, message: "Missing payment ID" }, { status: 400 })
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
    console.log("PhonePe verification result:", verificationResult)

    if (verificationResult.success && verificationResult.paymentSuccess) {
      // Update payment status in Firestore
      await updateDoc(doc(db, "payments", paymentId), {
        status: "COMPLETED",
        transactionId: verificationResult.transactionId,
        paymentState: verificationResult.paymentState,
        responseCode: verificationResult.responseCode,
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
        transactionId: verificationResult.transactionId,
        purchaseDate: serverTimestamp(),
      })

      return NextResponse.json({
        success: true,
        paymentSuccess: true,
        message: "Payment verified successfully",
        orderId: purchaseRef.id,
        amount: paymentData.amount,
      })
    } else if (verificationResult.success) {
      // Payment was found but not successful
      await updateDoc(doc(db, "payments", paymentId), {
        status: "FAILED",
        paymentState: verificationResult.paymentState,
        responseCode: verificationResult.responseCode,
        updatedAt: serverTimestamp(),
      })

      return NextResponse.json({
        success: true,
        paymentSuccess: false,
        message: "Payment was not successful",
      })
    } else {
      // Error verifying payment
      return NextResponse.json({
        success: false,
        paymentSuccess: false,
        message: "Error verifying payment with PhonePe",
        error: verificationResult.error,
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
