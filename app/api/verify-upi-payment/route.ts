import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase-config"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getServerUser } from "@/lib/server-auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { orderId, transactionId } = data

    if (!orderId || !transactionId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // In a real implementation, you would verify the payment with the UPI provider
    // For now, we'll just update the order status

    // Find the order in Firestore
    const ordersRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(ordersRef)

    if (!orderSnap.exists()) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    const orderData = orderSnap.data()

    // Check if the order belongs to the current user
    if (orderData.userId !== user.uid) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Update the order status
    await updateDoc(ordersRef, {
      status: "verified",
      transactionId,
      verifiedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, message: "An error occurred while verifying payment" }, { status: 500 })
  }
}
