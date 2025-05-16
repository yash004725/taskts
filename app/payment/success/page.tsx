"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { TARGET_URL } from "@/lib/phonepe-integration"

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get parameters from URL
  const merchantTransactionId = searchParams.get("merchantTransactionId")
  const transactionId = searchParams.get("transactionId")
  const code = searchParams.get("code")

  useEffect(() => {
    // For debugging
    console.log("URL Parameters:", {
      merchantTransactionId,
      transactionId,
      code,
      allParams: Object.fromEntries(searchParams.entries()),
    })

    const verifyPayment = async () => {
      try {
        // If we have a code from PhonePe and it's successful
        if (code === "PAYMENT_SUCCESS" || code === "SUCCESS") {
          console.log("Payment success code detected in URL")
          setStatus("success")
          setMessage("Payment successful! Redirecting to your digital content...")

          // Redirect to target URL after 3 seconds
          setTimeout(() => {
            window.location.href = TARGET_URL
          }, 3000)
          return
        }

        // If we have a merchantTransactionId, verify with our API
        if (merchantTransactionId) {
          console.log("Verifying payment with merchantTransactionId:", merchantTransactionId)

          const response = await fetch(`/api/verify-payment?merchantTransactionId=${merchantTransactionId}`, {
            method: "GET",
          })

          const data = await response.json()
          console.log("Verification response:", data)

          if (data.success && data.paymentSuccess) {
            setStatus("success")
            setMessage("Payment successful! Redirecting to your digital content...")

            // Redirect to target URL after 3 seconds
            setTimeout(() => {
              window.location.href = data.targetUrl || TARGET_URL
            }, 3000)
          } else {
            setStatus("error")
            setMessage(data.error || "Payment verification failed. Please contact support.")
          }
          return
        }

        // Direct success parameter (PhonePe might redirect with this)
        if (searchParams.get("success") === "true") {
          console.log("Success parameter found in URL")
          setStatus("success")
          setMessage("Payment successful! Redirecting to your digital content...")

          // Redirect to target URL after 3 seconds
          setTimeout(() => {
            window.location.href = TARGET_URL
          }, 3000)
          return
        }

        // If we don't have any payment reference
        console.log("No payment reference found in URL")
        setStatus("error")
        setMessage("Invalid payment reference. Please try again or contact support.")
      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("error")
        setMessage("An error occurred while verifying your payment. Please contact support.")
      }
    }

    verifyPayment()
  }, [code, transactionId, merchantTransactionId, searchParams])

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
                <div className="mt-4 w-full bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-700 font-medium">Redirecting to your digital content...</p>
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
                <Link href={TARGET_URL}>Access Your Digital Content Now</Link>
              </Button>
            )}
            {status === "error" && (
              <Button className="w-full" asChild>
                <Link href="/payment">Try Again</Link>
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
