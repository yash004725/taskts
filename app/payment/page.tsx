"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"
import { Loader2, Smartphone } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState({
    orderId: `order_${Date.now()}`,
    amount: 0,
    productId: "",
    productName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  })

  // Check if we're returning from a payment
  useEffect(() => {
    const orderId = searchParams.get("orderId")
    const paymentStatus = searchParams.get("paymentStatus")

    if (orderId && paymentStatus === "SUCCESS") {
      // Redirect to success page
      router.push(
        `/payment/success?orderId=${orderId}&amount=${orderDetails.amount}&productName=${encodeURIComponent(orderDetails.productName)}`,
      )
      return
    }

    // Get product details from URL params
    const productId = searchParams.get("productId")
    const amount = searchParams.get("amount")
    const productName = searchParams.get("productName")

    if (productId && amount && productName) {
      setOrderDetails({
        ...orderDetails,
        productId,
        amount: Number.parseFloat(amount),
        productName: decodeURIComponent(productName),
      })
    }
  }, [searchParams, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrderDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!orderDetails.customerName || !orderDetails.customerEmail || !orderDetails.customerPhone) {
        throw new Error("Please fill in all required fields")
      }

      // Process PhonePe payment
      const response = await fetch("/api/create-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: orderDetails.productId,
          productName: orderDetails.productName,
          amount: orderDetails.amount,
          mobileNumber: orderDetails.customerPhone,
          email: orderDetails.customerEmail,
          customerName: orderDetails.customerName,
        }),
      })

      const data = await response.json()
      console.log("Payment initiation response:", data)

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to initiate PhonePe payment")
      }

      // Save order details to Firebase before redirecting
      try {
        const { db } = await import("@/lib/firebase-config")
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

        await addDoc(collection(db, "orders"), {
          productId: orderDetails.productId,
          productName: orderDetails.productName,
          amount: orderDetails.amount,
          customerName: orderDetails.customerName,
          customerEmail: orderDetails.customerEmail,
          customerPhone: orderDetails.customerPhone,
          merchantTransactionId: data.merchantTransactionId,
          status: "PENDING",
          paymentMethod: "PhonePe",
          createdAt: serverTimestamp(),
        })
      } catch (error) {
        console.error("Error saving order to Firebase:", error)
        // Continue with payment even if Firebase save fails
      }

      // Redirect to PhonePe payment page
      window.location.href = data.paymentUrl
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8 flex-1">
        <div className="max-w-md mx-auto">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold blue-gradient-text">Complete Your Payment</CardTitle>
              <CardDescription>Please provide your details to proceed with the payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product</Label>
                  <Input id="productName" value={orderDetails.productName} readOnly className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    value={formatPrice(orderDetails.amount)}
                    readOnly
                    className="bg-gray-50 font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={orderDetails.customerName}
                    onChange={handleInputChange}
                    required
                    className="border-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={orderDetails.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="border-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={orderDetails.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="border-blue-200"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-md border border-purple-100 flex items-center">
                  <div className="w-10 h-10 relative mr-3">
                    <Image src="/phonepe-logo.png" alt="PhonePe" fill className="object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Pay securely with PhonePe</p>
                    <p className="text-xs text-purple-600">UPI, Cards, Netbanking & more</p>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Get Now
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-500">
              <div className="flex items-center">
                <span>Secure payment powered by PhonePe</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
