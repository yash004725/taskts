"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronRight, Clock, Download, FlameIcon as Fire, Play, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [hours, setHours] = useState(17)
  const [minutes, setMinutes] = useState(15)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else if (hours > 0) {
        setHours(hours - 1)
        setMinutes(59)
        setSeconds(59)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [hours, minutes, seconds])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Countdown Timer Banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white py-3 px-4 text-center sticky top-0 z-50">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="flex items-center">
            <Fire className="h-5 w-5 mr-2 text-yellow-300" /> Launch Offer Expiring Today
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-mono bg-black bg-opacity-30 px-2 py-1 rounded">
              {hours.toString().padStart(2, "0")}
            </span>
            :
            <span className="font-mono bg-black bg-opacity-30 px-2 py-1 rounded">
              {minutes.toString().padStart(2, "0")}
            </span>
            :
            <span className="font-mono bg-black bg-opacity-30 px-2 py-1 rounded">
              {seconds.toString().padStart(2, "0")}
            </span>
          </span>
          <span className="hidden sm:inline">|</span>
          <span>Unlimited Access, One-Time Deal! 🔥</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-purple-800 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div className="space-y-6" initial="hidden" animate="visible" variants={fadeIn}>
              <Badge className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 text-sm">
                LIMITED TIME OFFER
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-yellow-300">COMPLETE</span> <br />
                <span className="text-yellow-400">3D ANIMATION</span>
              </h1>
              <div className="bg-red-600 inline-block px-4 py-2 rounded-md">
                <h2 className="text-xl md:text-2xl font-bold">BASIC TO ADVANCE</h2>
              </div>
              <ul className="space-y-2">
                {["3D MODELING", "3D ANIMATION", "MOTION GRAPHICS", "VISUAL EFFECTS", "RENDERING"].map(
                  (item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span className="text-lg">{item}</span>
                    </motion.li>
                  ),
                )}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 animate-pulse"
                  asChild
                >
                  <Link href="/checkout">
                    Get Now - Just ₹249 <ShoppingCart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  Watch Preview <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="flex gap-4 mt-6">
                <Button size="lg" asChild>
                  <Link href="/buy-now">Buy Now - ₹249 Only</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qdRqPXkVuHQuUIQcUuvWg3sTblCE2C.png"
                  alt="3D Animation Course"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Details Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              What You'll Learn
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Master the art of 3D animation with our comprehensive course designed for beginners and intermediate
              learners
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {courseModules.map((module, index) => (
              <motion.div key={module.title} variants={fadeIn}>
                <Card className="h-full border-blue-100 hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-blue-600">{module.icon}</div>
                    <h3 className="font-semibold text-lg mb-2 text-blue-700">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Software Used Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Industry-Standard Software
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn to use the same tools that professionals use in the industry
            </p>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-8 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {softwareList.map((software, index) => (
              <motion.div key={software.name} className="text-center" variants={fadeIn}>
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image
                    src={software.icon || "/placeholder.svg"}
                    alt={software.name}
                    width={40}
                    height={40}
                    className="mx-auto"
                  />
                </div>
                <h3 className="font-medium">{software.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mega Bonus Section */}
      <section className="py-16 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Badge className="bg-yellow-500 text-black mb-4">EXCLUSIVE BONUSES</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get <span className="text-yellow-400">5 Premium Bonuses</span> Worth ₹19,999+
            </h2>
            <p className="text-lg mb-8 text-gray-300 max-w-3xl mx-auto">
              When you enroll in our 3D Animation Course today, you'll also get these incredible bonuses absolutely
              FREE!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bonus 1 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Card className="bg-gradient-to-br from-purple-900 to-purple-700 border-0 text-white h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gv7TJeKv96rS3TMWQH66pInUOWpu6y.png"
                      alt="675 GB Graphics Bundle Pack"
                      width={400}
                      height={400}
                      className="rounded-lg w-full"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      FREE
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">675 GB Graphics Bundle Pack</h3>
                  <ul className="space-y-2 mb-4 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>50K+ Fonts Collections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>7000+ Logo Designs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>3000+ Animated Infographics</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="line-through text-gray-300">₹5,999</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span>Your Price:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bonus 2 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Card className="bg-gradient-to-br from-blue-900 to-blue-700 border-0 text-white h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eapK4nDXqR9ix747PzRgRy6pQHv9eK.png"
                      alt="All India Database"
                      width={400}
                      height={400}
                      className="rounded-lg w-full"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      FREE
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">All India 100 Crore+ Database</h3>
                  <ul className="space-y-2 mb-4 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Email, Phone, Groups & more</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Best for marketing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>All India B2B & B2C Database</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="line-through text-gray-300">₹4,999</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span>Your Price:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bonus 3 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Card className="bg-gradient-to-br from-yellow-900 to-yellow-700 border-0 text-white h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nV4R9QqxJjpLJa7x396sQbVZW12RdY.png"
                      alt="Luxury Car Reels"
                      width={400}
                      height={400}
                      className="rounded-lg w-full"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      FREE
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">2000+ Luxury Car Reels Bundle</h3>
                  <ul className="space-y-2 mb-4 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>High Quality Reels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Copyright Free</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Save up to 50%</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="line-through text-gray-300">₹2,999</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span>Your Price:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bonus 4 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Card className="bg-gradient-to-br from-indigo-900 to-indigo-700 border-0 text-white h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rM0XDb6eYuFxrL6XUqZGZnrt3nfjKt.png"
                      alt="800+ Mega Courses Bundle"
                      width={400}
                      height={400}
                      className="rounded-lg w-full"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      FREE
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">800+ Mega Courses Bundle</h3>
                  <ul className="space-y-2 mb-4 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Top Creators Premium Courses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Hindi + English Language</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>50,000+ Reels Bundle</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="line-through text-gray-300">₹3,999</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span>Your Price:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bonus 5 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Card className="bg-gradient-to-br from-red-900 to-red-700 border-0 text-white h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dgDtV2juwcvYa5zkP3KGiLljhYJoCn.png"
                      alt="2000+ Premium Digital Products"
                      width={400}
                      height={400}
                      className="rounded-lg w-full"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      FREE
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">2000+ Premium Digital Products</h3>
                  <ul className="space-y-2 mb-4 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>100% Resell Right Bundle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Adobe All Software</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>900+ GB Graphics</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="line-through text-gray-300">₹2,999</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span>Your Price:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bonus 6 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Card className="bg-gradient-to-br from-green-900 to-green-700 border-0 text-white h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 relative">
                    <Image
                      src="https://sjc.microlink.io/sxxYZwte-fIHuEXb2-aDSM5FfGDGt3rnCB2Y-KG-kMEraChsBVKxX7R1fXjaNOCmOhq3qe-HGxUQVNQ_s7cEQg.jpeg"
                      alt="300+ Premium Lifetime Software"
                      width={400}
                      height={400}
                      className="rounded-lg w-full"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      FREE
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">300+ Premium Lifetime Software</h3>
                  <ul className="space-y-2 mb-4 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Win & Mac & Android</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Lifetime - Unlimited Installation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <span>Total Worth ₹19,999+</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="line-through text-gray-300">₹2,999</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span>Your Price:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              What Our Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied students who have transformed their careers with our courses
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-blue-100 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center space-x-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "fill-current" : "stroke-current fill-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-blue-700">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-blue-100 text-blue-800 mb-4">LIMITED TIME OFFER</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started Today For Just <span className="text-blue-600">₹249</span>
              </h2>
              <div className="flex items-center justify-center mb-6">
                <span className="text-gray-500 line-through text-xl mr-3">₹1999</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">87% OFF</span>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4">Here's Everything You'll Get:</h3>
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>Complete 3D Animation Course (₹1999 value)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>675 GB Graphics Bundle Pack (₹5999 value)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>All India 100 Crore+ Database (₹4999 value)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>2000+ Luxury Car Reels Bundle (₹2999 value)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>800+ Mega Courses Bundle (₹3999 value)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>2000+ Premium Digital Products (₹2999 value)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>300+ Premium Lifetime Software (₹2999 value)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>24/7 Support & Community Access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <span>Lifetime Access to All Course Materials</span>
                </li>
              </ul>
              <div className="text-center">
                <h4 className="text-lg font-medium mb-2">
                  Total Value: <span className="line-through">₹25,993</span>
                </h4>
                <h3 className="text-2xl font-bold mb-6">
                  Today's Price: <span className="text-blue-600">₹249</span>
                </h3>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white animate-pulse"
                  asChild
                >
                  <Link href="/checkout">
                    Get Now <Download className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            <p className="text-gray-500 text-sm">
              Secure payment via PhonePe. 7-day money-back guarantee if you're not satisfied.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="course">Course</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4">
                {faqs
                  .filter((faq) => faq.category === "general")
                  .map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-blue-100">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>
              <TabsContent value="course" className="space-y-4">
                {faqs
                  .filter((faq) => faq.category === "course")
                  .map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-blue-100">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>
              <TabsContent value="payment" className="space-y-4">
                {faqs
                  .filter((faq) => faq.category === "payment")
                  .map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-blue-100">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your 3D Animation Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Join thousands of students who have transformed their skills and careers with our comprehensive courses.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 animate-pulse"
              asChild
            >
              <Link href="/checkout">
                Get Now - Just ₹249 <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-semibold">Course Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsVideoModalOpen(false)}>
                ✕
              </Button>
            </div>
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Video preview would play here</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// Course Modules
const courseModules = [
  {
    icon: "🔷",
    title: "3D Modeling Fundamentals",
    description: "Learn to create 3D models from scratch using industry-standard tools and techniques",
  },
  {
    icon: "🔶",
    title: "Character Animation",
    description: "Master the principles of animation and bring your characters to life with realistic movements",
  },
  {
    icon: "💠",
    title: "Environment Design",
    description: "Create stunning 3D environments with proper lighting, texturing, and composition",
  },
  {
    icon: "🌟",
    title: "Visual Effects",
    description: "Add impressive visual effects to your animations using particle systems and dynamics",
  },
  {
    icon: "🎬",
    title: "Rendering & Compositing",
    description: "Learn professional rendering techniques and post-production workflows",
  },
  {
    icon: "🚀",
    title: "Portfolio Development",
    description: "Build an impressive portfolio of 3D animation projects to showcase your skills",
  },
]

// Software List
const softwareList = [
  {
    name: "Autodesk Maya",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Blender",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "After Effects",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Cinema 4D",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "ZBrush",
    icon: "/placeholder.svg?height=40&width=40",
  },
]

// Testimonials
const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "3D Animator at Studio XYZ",
    content:
      "This course completely transformed my career. I went from knowing nothing about 3D animation to landing a job at a top studio within 6 months!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Freelance Animator",
    content:
      "The course content is incredibly comprehensive and well-structured. I'm now earning a full-time income as a freelance 3D animator.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Game Developer",
    content:
      "The skills I learned in this course helped me create amazing 3D assets for my games. The bonus graphic design course was also extremely valuable!",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
]

// FAQs
const faqs = [
  {
    question: "Is this course suitable for complete beginners?",
    answer:
      "Yes, this course is designed to take you from the very basics to advanced techniques. No prior experience is required.",
    category: "general",
  },
  {
    question: "What software will I need?",
    answer:
      "We primarily use Autodesk Maya and Blender in this course. Both offer free student/trial versions that you can use to follow along.",
    category: "course",
  },
  {
    question: "How long do I have access to the course?",
    answer: "You'll have lifetime access to all course materials, including any future updates and improvements.",
    category: "general",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within 7 days of purchase.",
    category: "payment",
  },
  {
    question: "How is the course delivered?",
    answer:
      "The course is delivered through our online learning platform. You'll get immediate access to all video lessons, downloadable resources, and community forums.",
    category: "course",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all UPI apps through PhonePe payment gateway, including Google Pay, PhonePe, Paytm, and more.",
    category: "payment",
  },
  {
    question: "Will I get all the bonuses immediately?",
    answer: "Yes, you'll get instant access to all bonuses immediately after your payment is confirmed.",
    category: "payment",
  },
  {
    question: "How many hours of content are included?",
    answer:
      "The 3D Animation course includes over 40 hours of video content, plus additional resources and practice files.",
    category: "course",
  },
]
