"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ShoppingCart, Download, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useFirebase } from "@/lib/firebase-context"
import { useAuth } from "@/lib/auth-context"
import { collection, query, where, getDocs } from "firebase/firestore"
import { formatPrice, getDiscountPercentage } from "@/lib/utils"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Make sure we're using consistent parameter naming
// This file should use 'slug' consistently

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { db } = useFirebase()
  const { user } = useAuth()
  const { toast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [alreadyPurchased, setAlreadyPurchased] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!db) return

        // Query product by slug
        const productsRef = collection(db, "products")
        const q = query(productsRef, where("slug", "==", params.slug))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          })
          router.push("/products")
          return
        }

        const productData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        }

        setProduct(productData)

        // Check if user has already purchased this product
        if (user) {
          const purchasesRef = collection(db, "purchases")
          const purchaseQuery = query(
            purchasesRef,
            where("userId", "==", user.uid),
            where("productId", "==", productData.id),
          )
          const purchaseSnapshot = await getDocs(purchaseQuery)
          setAlreadyPurchased(!purchaseSnapshot.empty)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [db, params.slug, router, toast, user])

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make a purchase",
        variant: "destructive",
      })
      router.push(`/login?redirect=/products/${params.slug}`)
      return
    }

    if (alreadyPurchased) {
      router.push("/dashboard/downloads")
      return
    }

    setProcessingPayment(true)

    try {
      // Initiate PhonePe payment
      const response = await fetch("/api/create-phonepe-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.title,
          amount: product.price,
          userId: user.uid,
          email: user.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment")
      }

      // Redirect to PhonePe payment page
      window.location.href = data.paymentUrl
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
        variant: "destructive",
      })
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading product...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const discountPercentage = getDiscountPercentage(product.originalPrice, product.price)

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600">{product.category}</Badge>
                {alreadyPurchased && (
                  <Badge className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Purchased
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What You'll Get:</h3>
              <ul className="space-y-2">
                {product.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Option */}
            <div className="space-y-4">
              <Card className="bg-purple-50 border-purple-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative">
                    <Image src="/phonepe-logo.png" alt="PhonePe" fill className="object-contain" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-800">Pay securely with PhonePe</p>
                    <p className="text-xs text-purple-600">UPI, Cards, Netbanking & more</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleBuyNow}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : alreadyPurchased ? (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Go to Downloads
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </>
                )}
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">Secure payment powered by PhonePe</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-6">
            <div className="prose max-w-none">
              <h2>About This Product</h2>
              <p>{product.description}</p>
              {/* Additional product details would go here */}
            </div>
          </TabsContent>
          <TabsContent value="faqs">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {product.faqs?.map((faq: { question: string; answer: string }, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  )
}
