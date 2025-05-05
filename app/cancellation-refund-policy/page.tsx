import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata = {
  title: "Cancellation & Refund Policy | XDigitalHub",
  description: "Our cancellation and refund policy for digital products",
}

export default function CancellationRefundPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto py-10 px-4 md:px-6">
        <Card className="border-blue-100 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold blue-gradient-text">Cancellation & Refund Policy</CardTitle>
            <p className="text-sm text-gray-500">Last updated on 25-04-2025 20:05:24</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Deepa believes in helping its customers as far as possible, and has therefore a liberal cancellation
              policy. Under this policy:
            </p>

            <ul className="space-y-4 my-4">
              <li>
                Cancellations will be considered only if the request is made immediately after placing the order.
                However, the cancellation request may not be entertained if the orders have been communicated to the
                vendors/merchants and they have initiated the process of shipping them.
              </li>

              <li>
                In case you receive a defective, or inaccessible digital product, please report the issue to our
                Customer Support team within 2 days of purchase or download. Your request will be reviewed, and action
                will be taken once our team verifies the problem on our end.
              </li>

              <li>
                If you feel that the digital product does not match its description or does not meet your expectations,
                you must notify our Customer Support team within 2 days of purchase. After investigating your concern,
                our team will make an appropriate decision regarding replacement, correction, or refund.
              </li>

              <li>
                For digital products that come with a manufacturer or developer warranty or support, we recommend
                contacting them directly for resolution.
              </li>

              <li>
                In case a refund is approved by Deepa, it will be processed within 1-2 business days, and the amount
                will be credited to the original payment method within 5-7 business days, depending on your payment
                provider.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Digital Products Refund Policy</h3>

            <p>For digital products, the following refund policy applies:</p>

            <ul className="space-y-4 my-4">
              <li>
                <strong>Ebooks and Documents:</strong> Refunds are available within 7 days of purchase if you are
                unsatisfied with the content. You must provide a reason for your refund request.
              </li>

              <li>
                <strong>Online Courses:</strong> A 14-day money-back guarantee is provided if you are not satisfied with
                the course content. You must have completed less than 30% of the course to be eligible.
              </li>

              <li>
                <strong>Templates and Tools:</strong> Refunds are available within 3 days of purchase if the product
                doesn't work as described. You must provide evidence of the issue.
              </li>

              <li>
                <strong>Subscription Services:</strong> You may cancel your subscription at any time. Refunds are not
                provided for partial months, but service will continue until the end of the billing period.
              </li>
            </ul>

            <p>
              To request a refund, please contact our customer support team at yk8292238@gmail.com with your order
              details and reason for the refund request.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
