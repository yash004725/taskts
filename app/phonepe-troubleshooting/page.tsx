export default function PhonePeTroubleshootingPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">PhonePe Integration Troubleshooting Guide</h1>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Issues and Solutions</h2>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <h3 className="font-bold text-amber-800">400 Bad Request Error</h3>
            <p className="text-amber-700">
              This is the most common error when integrating with PhonePe. It typically means there's an issue with your
              request format, payload structure, or authentication.
            </p>
            <ul className="list-disc pl-6 text-amber-700">
              <li>Verify your merchant credentials (MERCHANT_ID, SALT_KEY, SALT_INDEX)</li>
              <li>Ensure your payload structure exactly matches PhonePe's documentation</li>
              <li>Check that your base64 encoding and checksum generation are correct</li>
              <li>Verify that your callback and redirect URLs are properly formatted and accessible</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="font-bold text-blue-800">Authentication Failures</h3>
            <p className="text-blue-700">
              Authentication issues are often related to incorrect checksum generation or invalid merchant credentials.
            </p>
            <ul className="list-disc pl-6 text-blue-700">
              <li>Double-check your SALT_KEY and SALT_INDEX values</li>
              <li>
                Ensure you're following the exact checksum generation format: base64(payload) + "/pg/v1/pay" + SALT_KEY
              </li>
              <li>Verify that your X-VERIFY header is correctly formatted as: sha256 + "###" + SALT_INDEX</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <h3 className="font-bold text-green-800">URL and Callback Issues</h3>
            <p className="text-green-700">
              PhonePe requires properly formatted and accessible callback and redirect URLs.
            </p>
            <ul className="list-disc pl-6 text-green-700">
              <li>Ensure your NEXT_PUBLIC_APP_URL environment variable is set correctly</li>
              <li>URLs must be publicly accessible (not localhost in production)</li>
              <li>URLs should be properly encoded if they contain special characters</li>
              <li>For testing, use a service like ngrok to expose your local server</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Debugging Steps</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Use the Test Page:</strong> Visit the{" "}
              <a href="/phonepe-test" className="text-blue-600 hover:underline">
                /phonepe-test
              </a>{" "}
              page to run different test scenarios.
            </li>
            <li>
              <strong>Check Debug Information:</strong> Use the Debug tab on the test page to verify your environment
              variables and checksum generation.
            </li>
            <li>
              <strong>Try the Minimal Test:</strong> The minimal test uses the absolute simplest approach to integrate
              with PhonePe, which can help isolate issues.
            </li>
            <li>
              <strong>Examine Server Logs:</strong> Check your server logs for detailed error messages and API
              responses.
            </li>
            <li>
              <strong>Verify Credentials:</strong> Ensure your PhonePe merchant credentials are correct and active.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <p>
            If you continue to experience issues after trying the steps above, please contact PhonePe merchant support
            or your account manager for assistance.
          </p>
        </section>
      </div>
    </div>
  )
}
