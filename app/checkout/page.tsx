"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, ArrowLeft, Clock, Loader2, AlertCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate phone number format (10 digits)
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(formData.phone)) {
        toast({
          title: "Error",
          description: "Please enter a valid 10-digit phone number",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      console.log("Starting payment process with form data:", formData)

      // Create payment with PhonePe
      const response = await fetch("/api/create-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: "3d-animation-course",
          productName: "Complete 3D Animation Course",
          amount: 249,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      })

      console.log("Payment API response status:", response.status)

      const data = await response.json()
      console.log("Payment initiation response:", data)

      if (data.status === "success" && data.paymentUrl) {
        // Redirect to PhonePe payment page
        console.log("Redirecting to payment URL:", data.paymentUrl)
        window.location.href = data.paymentUrl
      } else {
        // Store debug info
        setDebugInfo(data)

        // Show error message
        const errorMessage = data.error || data.message || "Failed to initiate payment"
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Payment error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred during payment"
      setError(errorMessage)
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <form onSubmit={handleCheckout}>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Payment Error</p>
                          <p className="text-sm">{error}</p>
                          <p className="text-sm mt-1">Please try again or contact support if the problem persists.</p>

                          {/* Debug information */}
                          {debugInfo && (
                            <details className="mt-2 text-xs">
                              <summary className="cursor-pointer">Debug Information</summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                                {JSON.stringify(debugInfo, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (10 digits)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                      />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p>Your payment information is processed securely through PhonePe.</p>
                      <div className="flex items-center mt-2 gap-2">
                        <Image src="/phonepe-logo.png" alt="PhonePe" width={80} height={30} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Get Now"
                      )}
                    </Button>
                    <div className="flex items-center justify-center text-sm text-gray-500 gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Secure payment powered by PhonePe</span>
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Course Item */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qdRqPXkVuHQuUIQcUuvWg3sTblCE2C.png"
                          alt="3D Animation Course"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">Complete 3D Animation Course</h4>
                        <p className="text-sm text-gray-500">Basic to Advanced</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹249</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Bonuses */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Included Bonuses:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>675 GB Graphics Bundle Pack</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>All India 100 Crore+ Database</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>2000+ Luxury Car Reels Bundle</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>800+ Mega Courses Bundle</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>2000+ Premium Digital Products</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>300+ Premium Lifetime Software</span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Course Price</span>
                      <span>₹1999</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bonuses Value</span>
                      <span>₹23,994</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-₹25,744</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹249</span>
                    </div>
                  </div>

                  {/* Limited Time Offer */}
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm">
                    <div className="flex items-center gap-2 text-yellow-800 font-medium mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Limited Time Offer</span>
                    </div>
                    <p className="text-yellow-700">
                      This special price is only available for a limited time. Get it now before the price increases!
                    </p>
                  </div>

                  {/* Guarantee */}
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                    <p className="font-medium mb-1">7-Day Money-Back Guarantee</p>
                    <p>Not satisfied? Get a full refund within 7 days of purchase.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
