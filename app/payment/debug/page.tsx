"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PaymentDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "Test User",
    email: "test@example.com",
    phone: "9876543210",
  })

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
    setResult(null)

    try {
      // Create payment
      const response = await fetch("/api/simple-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseText = await response.text()
      console.log("Raw API response:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        setError("Invalid JSON response from server")
        console.error("Failed to parse response as JSON:", e)
        setIsLoading(false)
        return
      }

      console.log("Payment initiation response:", data)
      setResult(data)

      if (data.success && data.url) {
        // Open payment URL in a new tab
        window.open(data.url, "_blank")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An error occurred. Please check the console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">PhonePe Integration Debug</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">{error}</div>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Test PhonePe Payment"
                )}
              </Button>
            </CardFooter>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea className="font-mono text-sm h-64" readOnly value={JSON.stringify(result, null, 2)} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
