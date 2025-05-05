"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PhonePeTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)

  const runDebugTest = async () => {
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)
    setTestResult(null)

    try {
      // Fetch debug info
      const debugResponse = await fetch("/api/debug-phonepe")
      const debugData = await debugResponse.json()
      setDebugInfo(debugData)

      // Test minimal payment
      const testResponse = await fetch("/api/test-phonepe-minimal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1, // 1 rupee for testing
        }),
      })

      const testData = await testResponse.json()
      setTestResult(testData)
    } catch (error) {
      console.error("Test error:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/checkout">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">PhonePe Integration Test</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>PhonePe Integration Diagnostics</CardTitle>
            <CardDescription>This page helps diagnose issues with the PhonePe payment integration.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={runDebugTest} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run Diagnostic Tests"
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            {debugInfo && (
              <div className="w-full space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Merchant ID:</div>
                      <div>{debugInfo.environment.merchantId}</div>
                      <div>Salt Key:</div>
                      <div>{debugInfo.environment.saltKey}</div>
                      <div>Salt Index:</div>
                      <div>{debugInfo.environment.saltIndex}</div>
                      <div>App URL:</div>
                      <div>{debugInfo.environment.appUrl}</div>
                      <div>API Key:</div>
                      <div>✅ Set</div>
                      <div>Mode:</div>
                      <div>{debugInfo.mode}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Test API Call</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <div className="mb-2">
                      <span className="font-medium">Status: </span>
                      <span className={debugInfo.testApiCall?.status === "200" ? "text-green-600" : "text-red-600"}>
                        {debugInfo.testApiCall?.status}
                      </span>
                    </div>
                    <details>
                      <summary className="cursor-pointer">Response</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40 text-xs">
                        {debugInfo.testApiCall?.response}
                      </pre>
                    </details>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Headers</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <pre className="overflow-auto max-h-40 text-xs">{JSON.stringify(debugInfo.headers, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {testResult && (
              <>
                <Separator className="my-4" />
                <div className="w-full">
                  <h3 className="font-medium mb-2">Minimal Payment Test</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <div className="mb-2">
                      <span className="font-medium">Status: </span>
                      <span className={testResult.success ? "text-green-600" : "text-red-600"}>
                        {testResult.success ? "Success" : "Failed"}
                      </span>
                    </div>
                    {testResult.error && (
                      <div className="mb-2 text-red-600">
                        <span className="font-medium">Error: </span>
                        {testResult.error}
                      </div>
                    )}
                    {testResult.paymentUrl && (
                      <div className="mb-2">
                        <span className="font-medium">Payment URL: </span>
                        <a
                          href={testResult.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Open Payment Page
                        </a>
                      </div>
                    )}
                    <details>
                      <summary className="cursor-pointer">Full Response</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40 text-xs">
                        {JSON.stringify(testResult, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
