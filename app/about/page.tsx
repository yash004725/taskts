import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata = {
  title: "About Us | XDigitalHub",
  description: "Learn more about XDigitalHub and our mission",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden mb-16 h-80 md:h-96">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000"
            alt="XDigitalHub Team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60 flex items-center">
            <div className="container mx-auto px-4 md:px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About XDigitalHub</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Empowering digital creators and businesses with premium resources since 2020
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 blue-gradient-text">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                XDigitalHub was founded in 2020 with a simple mission: to provide high-quality digital resources that
                help businesses and creators thrive in the digital landscape. What started as a small collection of
                marketing templates has grown into a comprehensive marketplace offering ebooks, courses, tools, and
                templates across various digital disciplines.
              </p>
              <p>
                Our founder, Yash Kumar, recognized a gap in the market for affordable yet professional digital
                resources that deliver real results. Drawing from his experience in digital marketing and e-commerce, he
                assembled a team of experts to create products that combine cutting-edge strategies with practical,
                actionable advice.
              </p>
              <p>
                Today, XDigitalHub serves thousands of customers worldwide, from solo entrepreneurs to established
                businesses, all seeking to elevate their digital presence and achieve measurable growth.
              </p>
            </div>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000"
              alt="Our Story"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Our Mission */}
        <Card className="border-blue-100 mb-20">
          <CardContent className="p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 blue-gradient-text">Our Mission</h2>
              <p className="text-xl text-gray-700 mb-8">
                To democratize access to premium digital knowledge and tools, enabling businesses of all sizes to
                compete effectively in the digital marketplace.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M12 2v4"></path>
                      <path d="M12 18v4"></path>
                      <path d="m4.93 4.93 2.83 2.83"></path>
                      <path d="m16.24 16.24 2.83 2.83"></path>
                      <path d="M2 12h4"></path>
                      <path d="M18 12h4"></path>
                      <path d="m4.93 19.07 2.83-2.83"></path>
                      <path d="m16.24 7.76 2.83-2.83"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quality</h3>
                  <p className="text-gray-600">
                    We're committed to creating resources that meet the highest standards of quality and effectiveness.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Education</h3>
                  <p className="text-gray-600">
                    We believe in empowering our customers with knowledge that drives real-world results.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-gray-600">
                    We foster a supportive community where digital professionals can learn and grow together.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center blue-gradient-text">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center blue-gradient-text">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg p-8 md:p-12 text-white mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Our Impact</h2>
            <p className="text-blue-100">The numbers speak for themselves</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">10K+</p>
              <p className="text-blue-100">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">50+</p>
              <p className="text-blue-100">Digital Products</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">15+</p>
              <p className="text-blue-100">Countries Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">4.8</p>
              <p className="text-blue-100">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 blue-gradient-text">Ready to Work With Us?</h2>
          <p className="text-gray-700 mb-8">
            Whether you're looking for digital products to grow your business or interested in collaborating with us,
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-md border border-blue-200 px-6 py-3 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

const team = [
  {
    name: "Yash Kumar",
    role: "Founder & CEO",
    bio: "Digital marketing expert with over 10 years of experience helping businesses grow online.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Content Director",
    bio: "Former journalist with a passion for creating educational content that drives results.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul Verma",
    role: "Product Manager",
    bio: "Tech enthusiast focused on creating user-friendly digital products and experiences.",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    name: "Ananya Patel",
    role: "Customer Success",
    bio: "Dedicated to ensuring our customers get the most value from our products.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
]

const testimonials = [
  {
    name: "Vikram Singh",
    role: "Marketing Director",
    content:
      "The digital marketing templates from XDigitalHub have completely transformed our approach to campaign planning. We've seen a 40% increase in ROI since implementing their strategies.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Meera Kapoor",
    role: "Entrepreneur",
    content:
      "As a small business owner, I was struggling with my online presence until I found XDigitalHub. Their resources are affordable yet incredibly valuable. My social media following has tripled!",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  },
  {
    name: "Arjun Mehta",
    role: "Freelance Designer",
    content:
      "The templates and tools from XDigitalHub have saved me countless hours of work. I can now deliver better results to my clients in less time, which has been great for my business.",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
]
