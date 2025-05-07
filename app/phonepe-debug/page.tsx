"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function PhonePeDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [formData, setFormData] = useState({
    name: "Test User",
    email: "test@example.com",
    phone: "9876543210",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse("")

    try {
      const response = await fetch("/api/create-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 249,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const responseText = await response.text()

      try {
        const data = JSON.parse(responseText)
        setResponse(JSON.stringify(data, null, 2))

        if (data.success && data.url) {
          // Wait 2 seconds before redirecting to allow viewing the response
          setTimeout(() => {
            window.location.href = data.url
          }, 2000)
        }
      } catch (e) {
        setResponse(responseText)
      }
    } catch (err) {
      setResponse(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">PhonePe Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Test Payment (₹249)"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={response}
              readOnly
              className="h-[300px] font-mono text-sm"
              placeholder="API response will appear here..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">PhonePe Integration Guide</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Common Issues:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>401 Unauthorized</strong>: Check if your merchant ID, API key, and salt key are correct.
            </li>
            <li>
              <strong>X-VERIFY Header</strong>: Make sure the checksum is generated correctly.
            </li>
            <li>
              <strong>Request Format</strong>: Ensure the request payload matches PhonePe's expected format.
            </li>
            <li>
              <strong>Callback URLs</strong>: Make sure the redirect and callback URLs are accessible.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
