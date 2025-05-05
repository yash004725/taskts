"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Bug, RefreshCw, Minimize } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PhonePeTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [directTestLoading, setDirectTestLoading] = useState(false)
  const [minimalTestLoading, setMinimalTestLoading] = useState(false)
  const [debugLoading, setDebugLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [directTestResponse, setDirectTestResponse] = useState<any>(null)
  const [minimalTestResponse, setMinimalTestResponse] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [directTestError, setDirectTestError] = useState<string | null>(null)
  const [minimalTestError, setMinimalTestError] = useState<string | null>(null)
  const [amount, setAmount] = useState("1")

  const handleTest = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Create a test payment
      const response = await fetch("/api/create-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: "test-product",
          productName: "Test Product",
          amount: Number.parseFloat(amount),
          customerName: "Test User",
          customerEmail: "test@example.com",
          customerPhone: "9876543210",
        }),
      })

      const data = await response.json()
      setResponse(data)

      if (data.status === "success" && data.paymentUrl) {
        // Open the payment URL in a new tab
        window.open(data.paymentUrl, "_blank")
      } else {
        setError(data.error || data.message || "Failed to initiate payment")
      }
    } catch (err) {
      console.error("Test error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectTest = async () => {
    setDirectTestLoading(true)
    setDirectTestError(null)
    setDirectTestResponse(null)

    try {
      const response = await fetch("/api/test-phonepe-direct")
      const data = await response.json()
      setDirectTestResponse(data)

      if (data.success && data.paymentUrl) {
        window.open(data.paymentUrl, "_blank")
      } else {
        setDirectTestError(data.error || "Failed to initiate direct payment test")
      }
    } catch (err) {
      console.error("Direct test error:", err)
      setDirectTestError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setDirectTestLoading(false)
    }
  }

  const handleMinimalTest = async () => {
    setMinimalTestLoading(true)
    setMinimalTestError(null)
    setMinimalTestResponse(null)

    try {
      const response = await fetch("/api/test-phonepe-minimal")
      const data = await response.json()
      setMinimalTestResponse(data)

      if (data.success && data.paymentUrl) {
        window.open(data.paymentUrl, "_blank")
      } else {
        setMinimalTestError(data.error || "Failed to initiate minimal payment test")
      }
    } catch (err) {
      console.error("Minimal test error:", err)
      setMinimalTestError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setMinimalTestLoading(false)
    }
  }

  const handleDebug = async () => {
    setDebugLoading(true)
    try {
      const response = await fetch("/api/debug-phonepe")
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      console.error("Debug error:", err)
    } finally {
      setDebugLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PhonePe Integration Test</h1>

      <Tabs defaultValue="standard">
        <TabsList className="mb-4">
          <TabsTrigger value="standard">Standard Test</TabsTrigger>
          <TabsTrigger value="direct">Direct API Test</TabsTrigger>
          <TabsTrigger value="minimal">Minimal Test</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Test PhonePe Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Test the PhonePe integration with a small payment amount.</p>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleTest} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Run Test"
                )}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Card className="mb-4 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          )}

          {response && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Payment Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="direct">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Direct PhonePe API Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This test bypasses all abstractions and directly calls the PhonePe API with minimal code.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDirectTest} disabled={directTestLoading}>
                {directTestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Direct Test
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {directTestError && (
            <Card className="mb-4 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-500">Direct Test Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{directTestError}</p>
              </CardContent>
            </Card>
          )}

          {directTestResponse && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Direct Test Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(directTestResponse, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="minimal">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Minimal PhonePe API Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This test uses the absolute minimal approach possible with PhonePe.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleMinimalTest} disabled={minimalTestLoading}>
                {minimalTestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Minimize className="mr-2 h-4 w-4" />
                    Run Minimal Test
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {minimalTestError && (
            <Card className="mb-4 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-500">Minimal Test Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{minimalTestError}</p>
              </CardContent>
            </Card>
          )}

          {minimalTestResponse && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Minimal Test Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(minimalTestResponse, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="debug">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Debug Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Check environment variables and test checksum generation.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDebug} disabled={debugLoading} variant="outline">
                {debugLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Bug className="mr-2 h-4 w-4" />
                    Debug Environment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {debugInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
