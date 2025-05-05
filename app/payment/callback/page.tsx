"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("paymentId")
  const code = searchParams.get("code")
  const transactionId = searchParams.get("transactionId")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId && !code && !transactionId) {
        setStatus("error")
        setMessage("Invalid payment reference")
        return
      }

      try {
        // If we have a code from PhonePe and it's successful, verify with our API
        if (code === "PAYMENT_SUCCESS" || code === "SUCCESS") {
          const response = await fetch(`/api/payment/verify?paymentId=${paymentId}&transactionId=${transactionId}`, {
            method: "GET",
          })

          const data = await response.json()

          if (data.success && data.paymentSuccess) {
            setStatus("success")
            setMessage("Payment successful! Redirecting to your course materials...")
            setOrderDetails(data.orderDetails)

            // Redirect to Google Drive after 3 seconds
            setTimeout(() => {
              window.location.href = "https://drive.google.com/drive/folders/1wRD4Gk0l7k6MaPRSw9Rn79bAKsB540C2"
            }, 3000)
          } else {
            setStatus("error")
            setMessage(data.message || "Payment verification failed. Please contact support.")
          }
          return
        }

        // Otherwise verify with our API
        const response = await fetch(`/api/payment/verify?paymentId=${paymentId}`, {
          method: "GET",
        })

        const data = await response.json()

        if (data.success && data.paymentSuccess) {
          setStatus("success")
          setMessage("Payment successful! Redirecting to your course materials...")
          setOrderDetails(data.orderDetails)

          // Redirect to Google Drive after 3 seconds
          setTimeout(() => {
            window.location.href = "https://drive.google.com/drive/folders/1wRD4Gk0l7k6MaPRSw9Rn79bAKsB540C2"
          }, 3000)
        } else {
          setStatus("error")
          setMessage(data.message || "Payment verification failed. Please contact support.")
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("error")
        setMessage("An error occurred while verifying your payment. Please contact support.")
      }
    }

    verifyPayment()
  }, [paymentId, code, transactionId])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Payment {status === "loading" ? "Processing" : status === "success" ? "Successful" : "Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            {status === "loading" && (
              <div className="py-8 flex flex-col items-center">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Verifying your payment...</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-8 flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
                <p className="text-gray-700 mb-6">{message}</p>
                {orderDetails && (
                  <div className="bg-gray-50 p-4 rounded-md w-full text-left">
                    <h3 className="font-medium mb-2">Order Details:</h3>
                    <p className="text-sm text-gray-600">Order ID: {orderDetails.orderId}</p>
                    <p className="text-sm text-gray-600">Amount: ₹{orderDetails.amount}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(orderDetails.timestamp).toLocaleString()}</p>
                  </div>
                )}
                <div className="mt-4 w-full bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-700 font-medium">Redirecting to your course materials...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-[progress_3s_ease-in-out]"></div>
                  </div>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="py-8 flex flex-col items-center">
                <XCircle className="h-16 w-16 text-red-600 mb-4" />
                <p className="text-gray-700 mb-6">{message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {status === "success" && (
              <Button className="w-full" asChild>
                <Link href="https://drive.google.com/drive/folders/1wRD4Gk0l7k6MaPRSw9Rn79bAKsB540C2">
                  Access Your Course Now
                </Link>
              </Button>
            )}
            {status === "error" && (
              <Button className="w-full" asChild>
                <Link href="/buy-now">Try Again</Link>
              </Button>
            )}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
