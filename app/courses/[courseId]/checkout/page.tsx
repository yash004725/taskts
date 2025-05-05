"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

// Ensure the parameter name is consistent
export default function CheckoutPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/courses/${params.courseId}/checkout`)
      return
    }

    async function fetchCourse() {
      try {
        const courseRef = doc(db, "courses", params.courseId)
        const courseSnap = await getDoc(courseRef)

        if (!courseSnap.exists()) {
          router.push("/courses")
          return
        }

        setCourse({
          id: courseSnap.id,
          ...courseSnap.data(),
        })

        // Create an order
        const orderRef = await addDoc(collection(db, "orders"), {
          userId: user.uid,
          courseId: params.courseId,
          amount: courseSnap.data().price || 0,
          status: "pending",
          createdAt: serverTimestamp(),
        })

        setOrderId(orderRef.id)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching course:", error)
        setError("Failed to load course details. Please try again.")
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseId, router, user])

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId || !transactionId || !screenshot || !user) {
      setError("Please provide all required information")
      return
    }

    setVerifying(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("orderId", orderId)
      formData.append("transactionId", transactionId)
      formData.append("userId", user.uid)
      formData.append("courseId", params.courseId)
      formData.append("screenshot", screenshot)

      const response = await fetch("/api/verify-upi-payment", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/dashboard/courses?status=pending&orderId=${orderId}`)
        }, 2000)
      } else {
        setError(data.message || "Failed to verify payment")
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      setError("An error occurred while verifying your payment")
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading checkout...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto py-20 text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/courses")}>Browse Courses</Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto py-20 text-center">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">Payment Verification Submitted!</h2>
        <p className="mb-6">We'll verify your payment and grant you access to the course soon.</p>
        <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Complete your purchase using UPI</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upi">
                <TabsList className="mb-6">
                  <TabsTrigger value="upi" className="flex-1">
                    UPI Payment
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upi">
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <h3 className="font-semibold text-lg mb-2">Order ID: #{orderId}</h3>
                      <p className="text-2xl font-bold mb-4">₹{course.price?.toFixed(2) || "0.00"}</p>

                      <div className="bg-white p-6 rounded-lg inline-block mb-4">
                        <div className="text-center mb-4">
                          <p className="font-medium">Scan to pay with any UPI app</p>
                        </div>
                        <div className="mb-4">
                          {/* Placeholder for QR code - in production, generate a real QR code */}
                          <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
                            <p className="text-sm text-gray-500">QR Code Placeholder</p>
                          </div>
                        </div>
                        <p className="text-center font-medium">7247811767@fam</p>
                      </div>

                      <p className="text-sm">
                        Please scan the QR code with any UPI app to make the payment. After payment, enter the
                        transaction details below.
                      </p>
                    </div>

                    <form onSubmit={handleVerifyPayment} className="space-y-4">
                      <div>
                        <Label htmlFor="transactionId">Enter 12-digit Transaction / UTR / Reference ID*</Label>
                        <Input
                          id="transactionId"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter transaction ID"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="screenshot">Upload Screenshot*</Label>
                        <Input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Please ensure that the amount has been deducted from your account before clicking "Confirm".
                          We will manually verify your transaction once submitted.
                        </p>
                      </div>

                      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                          Back
                        </Button>
                        <Button type="submit" disabled={verifying} className="flex-1">
                          {verifying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Confirm Payment"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-500">Digital Course</p>
                  </div>
                  <p>₹{course.price?.toFixed(2) || "0.00"}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>₹{course.price?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                By completing this purchase, you agree to our terms and conditions. Access to the course will be granted
                after payment verification.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
