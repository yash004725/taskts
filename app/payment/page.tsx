"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [debugInfo, setDebugInfo] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDebugInfo(null)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone) {
        setError("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      // Validate phone number format (10 digits)
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(formData.phone)) {
        setError("Please enter a valid 10-digit phone number without country code")
        setIsLoading(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        setIsLoading(false)
        return
      }

      // Create payment
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: 249,
        }),
      })

      // Get response as text first for debugging
      const responseText = await response.text()
      console.log("Raw API response:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        setError("Invalid response from server. Please try again or contact support.")
        console.error("Failed to parse response as JSON:", e, responseText)
        setIsLoading(false)
        return
      }

      console.log("Payment initiation response:", data)
      setDebugInfo(data)

      if (data.success && data.url) {
        // Redirect to payment page
        window.location.href = data.url
      } else {
        console.error("Payment initiation failed:", data)
        setError(
          data.error ||
            `Payment initiation failed (${data.code || "unknown error"}). Please try again or contact support.`,
        )
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An error occurred. Please try again or contact support.")
    } finally {
      setIsLoading(false)
    }
  }

  // For testing purposes, pre-fill the form in development
  const fillTestData = () => {
    if (process.env.NODE_ENV === "development") {
      setFormData({
        name: "Test User",
        email: "test@example.com",
        phone: "9876543210",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Purchase</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Info */}
            <div>
              <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="3D Animation Course"
                  width={500}
                  height={300}
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What You'll Get:</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Complete 3D Animation Course (Basic to Advanced)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>675 GB Graphics Bundle Pack</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All India 100 Crore+ Database</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>2000+ Luxury Car Reels Bundle</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>800+ Mega Courses Bundle</span>
                  </li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <p className="text-amber-800 font-medium">Limited Time Offer!</p>
                  <p className="text-amber-700 text-sm">
                    Original Price: <span className="line-through">₹25,993</span>
                  </p>
                  <p className="text-amber-900 font-bold text-xl">Today's Price: ₹249 only</p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Purchase</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="10-digit number without country code"
                      />
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Price:</span>
                        <span>₹25,993</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Discount:</span>
                        <span className="text-green-600">-₹25,744</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>₹249</span>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Payment Error</p>
                            <p>{error}</p>
                            <p className="mt-1 text-xs">
                              Need help? Contact us on WhatsApp:{" "}
                              <a href="https://wa.me/917247811767" className="underline">
                                7247811767
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay ₹249 Now"
                    )}
                  </Button>

                  {process.env.NODE_ENV === "development" && (
                    <Button variant="outline" onClick={fillTestData} type="button" className="mt-2">
                      Fill Test Data
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure payment via PhonePe</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
