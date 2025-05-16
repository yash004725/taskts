"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TestimonialCard from "@/components/testimonial-card"
import NewsletterSignup from "@/components/newsletter-signup"

export default function Home() {
  const [activeTab, setActiveTab] = useState("all")

  const features = [
    "Complete 3D Animation Course (Basic to Advanced)",
    "675 GB Graphics Bundle Pack",
    "All India 100 Crore+ Database",
    "2000+ Luxury Car Reels Bundle",
    "800+ Mega Courses Bundle",
  ]

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Graphic Designer",
      content:
        "This course completely transformed my career. I went from struggling to find clients to having a waiting list. The database alone was worth the investment!",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Freelance Animator",
      content:
        "I've taken many online courses, but this one stands out. The quality of content and the additional resources are exceptional. Highly recommended!",
      rating: 5,
    },
    {
      name: "Amit Kumar",
      role: "Marketing Professional",
      content:
        "The database has been a game-changer for our marketing campaigns. We've seen a 300% increase in conversion rates since implementing the strategies from this course.",
      rating: 5,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Complete 3D Animation Course + Mega Bundle
              </h1>
              <p className="mb-8 text-lg md:text-xl">
                Master 3D animation and get access to our exclusive database and resource bundle worth ₹25,993 for just
                ₹249 today!
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild size="lg" className="bg-white font-semibold text-purple-600 hover:bg-gray-100">
                  <Link href="/buy-now">Buy Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-video w-full max-w-lg rounded-lg bg-white/10 p-1 backdrop-blur-sm">
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-black/30 text-center">
                  <p className="px-4 text-lg">Course Preview Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">What You'll Get</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Our comprehensive package includes everything you need to master 3D animation and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-indigo-600"></div>
              <CardContent className="p-6">
                <h3 className="mb-3 text-xl font-bold">Complete 3D Animation Course</h3>
                <p className="text-gray-600">
                  Learn 3D animation from basics to advanced techniques with step-by-step tutorials.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-600"></div>
              <CardContent className="p-6">
                <h3 className="mb-3 text-xl font-bold">675 GB Graphics Bundle Pack</h3>
                <p className="text-gray-600">
                  Access a massive collection of premium graphics, templates, and design resources.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-amber-500 to-orange-600"></div>
              <CardContent className="p-6">
                <h3 className="mb-3 text-xl font-bold">All India 100 Crore+ Database</h3>
                <p className="text-gray-600">
                  Unlock our exclusive database with over 100 crore contacts for your marketing needs.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <div className="mx-auto max-w-3xl rounded-xl bg-gray-50 p-8">
              <h3 className="mb-6 text-center text-2xl font-bold">Everything Included in the Package</h3>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/buy-now">
                    Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Unbeatable Value</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Get access to our complete package at an incredible discount for a limited time.
            </p>
          </div>

          <div className="mx-auto max-w-lg">
            <Card className="overflow-hidden border-2 border-purple-500">
              <div className="bg-purple-500 p-4 text-center text-white">
                <p className="text-sm font-medium uppercase tracking-wider">Limited Time Offer</p>
              </div>
              <CardContent className="p-6">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold">Complete Digital Package</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="text-lg text-gray-500 line-through">₹25,993</span>
                    <span className="ml-3 text-4xl font-bold text-purple-600">₹249</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">One-time payment, lifetime access</p>
                </div>

                <ul className="mb-6 space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/buy-now">Buy Now - Only ₹249</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Students Say</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Don't just take our word for it. Here's what our students have achieved with our course and resources.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Find answers to common questions about our course and resources.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-8 grid w-full grid-cols-3">
                <TabsTrigger value="all">General</TabsTrigger>
                <TabsTrigger value="course">Course</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">What's included in the package?</h3>
                  <p className="mt-2 text-gray-600">
                    Our package includes the complete 3D animation course, 675 GB graphics bundle, All India 100 crore+
                    database, 2000+ luxury car reels bundle, and 800+ mega courses bundle.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">How long do I have access to the course?</h3>
                  <p className="mt-2 text-gray-600">
                    Once purchased, you have lifetime access to all the course materials and resources.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Is there a refund policy?</h3>
                  <p className="mt-2 text-gray-600">
                    Due to the digital nature of our products, we do not offer refunds. Please review our terms and
                    conditions for more details.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="course" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">What will I learn in the 3D animation course?</h3>
                  <p className="mt-2 text-gray-600">
                    You'll learn everything from basic principles to advanced techniques in 3D animation, including
                    modeling, texturing, rigging, animation, lighting, and rendering.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Do I need any prior experience?</h3>
                  <p className="mt-2 text-gray-600">
                    No prior experience is required. Our course is designed for beginners and gradually progresses to
                    advanced topics.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">What software will I need?</h3>
                  <p className="mt-2 text-gray-600">
                    The course primarily uses Blender, which is free and open-source. Some advanced tutorials may use
                    other software, but alternatives are always provided.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="payment" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">What payment methods do you accept?</h3>
                  <p className="mt-2 text-gray-600">
                    We accept all major credit/debit cards, UPI, net banking, and wallet payments through our secure
                    payment gateway.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Is the payment secure?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes, all payments are processed through PhonePe, a secure payment gateway that uses
                    industry-standard encryption to protect your information.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Will I get an invoice?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes, you'll receive an invoice via email after your purchase is complete.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Transform Your Skills?</h2>
            <p className="mb-8 text-lg">
              Get lifetime access to our complete 3D animation course and exclusive resources worth ₹25,993 for just
              ₹249 today!
            </p>
            <Button asChild size="lg" className="bg-white font-semibold text-purple-600 hover:bg-gray-100">
              <Link href="/buy-now">Buy Now - Limited Time Offer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSignup />

      <Footer />
    </div>
  )
}
