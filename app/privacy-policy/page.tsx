import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata = {
  title: "Privacy Policy | XDigitalHub",
  description: "Our privacy policy for digital products marketplace",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto py-10 px-4 md:px-6">
        <Card className="border-blue-100 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold blue-gradient-text">Privacy Policy</CardTitle>
            <p className="text-sm text-gray-500">Last updated on 30-04-2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              At XDigitalHub, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h3>

            <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>

            <ul className="space-y-4 my-4">
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address,
                telephone number, and demographic information that you voluntarily give to us when you register with the
                site or when you choose to participate in various activities related to the site.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers automatically collect when you access the
                site, such as your IP address, browser type, operating system, access times, and the pages you have
                viewed directly before and after accessing the site.
              </li>
              <li>
                <strong>Financial Data:</strong> Financial information, such as data related to your payment method
                (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase,
                order, return, exchange, or request information about our services from the site.
              </li>
              <li>
                <strong>Mobile Device Data:</strong> Device information, such as your mobile device ID, model, and
                manufacturer, and information about the location of your device, if you access the site from a mobile
                device.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Use of Your Information</h3>

            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized
              experience. Specifically, we may use information collected about you via the site to:
            </p>

            <ul className="space-y-4 my-4">
              <li>Create and manage your account.</li>
              <li>Process your orders and manage your transactions.</li>
              <li>Send you a newsletter or promotional emails.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the site.</li>
              <li>Increase the efficiency and operation of the site.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the site.</li>
              <li>Notify you of updates to the site.</li>
              <li>Resolve disputes and troubleshoot problems.</li>
              <li>Respond to product and customer service requests.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Disclosure of Your Information</h3>

            <p>
              We may share information we have collected about you in certain situations. Your information may be
              disclosed as follows:
            </p>

            <ul className="space-y-4 my-4">
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is
                necessary to respond to legal process, to investigate or remedy potential violations of our policies, or
                to protect the rights, property, and safety of others, we may share your information as permitted or
                required by any applicable law, rule, or regulation.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share your information with third parties that
                perform services for us or on our behalf, including payment processing, data analysis, email delivery,
                hosting services, customer service, and marketing assistance.
              </li>
              <li>
                <strong>Marketing Communications:</strong> With your consent, or with an opportunity for you to withdraw
                consent, we may share your information with third parties for marketing purposes.
              </li>
              <li>
                <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or
                during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a
                portion of our business to another company.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Security of Your Information</h3>

            <p>
              We use administrative, technical, and physical security measures to help protect your personal
              information. While we have taken reasonable steps to secure the personal information you provide to us,
              please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method
              of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Contact Us</h3>

            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>

            <p>
              XDigitalHub
              <br />
              Email: yk8292238@gmail.com
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
