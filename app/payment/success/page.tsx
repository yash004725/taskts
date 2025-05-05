"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { formatPrice } from "@/lib/utils"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    amount: 0,
    productName: "",
  })

  useEffect(() => {
    // Get order details from URL params
    const orderId = searchParams.get("orderId")
    const amount = searchParams.get("amount")
    const productName = searchParams.get("productName")

    if (!orderId) {
      // If no order ID, redirect to home
      router.push("/")
      return
    }

    setOrderDetails({
      orderId: orderId || "",
      amount: amount ? Number(amount) : 0,
      productName: productName || "",
    })

    // In a real app, you would verify the payment status with your backend here
  }, [searchParams, router])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12 flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md border-green-100">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
            <p className="text-gray-600 mt-2">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-t border-b py-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              {orderDetails.productName && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{orderDetails.productName}</span>
                </div>
              )}
              {orderDetails.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatPrice(orderDetails.amount)}</span>
                </div>
              )}
            </div>
            <div className="bg-green-50 p-4 rounded-md text-green-800 text-sm">
              <p>
                <strong>What's next?</strong> You will receive an email with your order details and download
                instructions. You can also access your purchases from your dashboard.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
