import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">XDigitalHub</h3>
            <p className="text-blue-100">
              Your one-stop destination for premium digital courses. Learn 3D animation and graphic design from industry
              experts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-blue-100 hover:text-white transition">
                  Enroll Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-conditions" className="text-blue-100 hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund-policy" className="text-blue-100 hover:text-white transition">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-blue-100 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-blue-100 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} XDigitalHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
