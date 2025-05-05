"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash, ArrowLeft, Save, Eye, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AdminLayout from "@/components/admin-layout"
import { useFirebase } from "@/lib/firebase-context"
import { generateSlug } from "@/lib/utils"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export default function EditProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { db } = useFirebase()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productData, setProductData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    image: "",
    status: "Draft",
    features: [""],
    faqs: [{ question: "", answer: "" }],
    reviews: [],
    buyNowLink: "",
    downloadLink: "", // Added for digital product downloads
    downloadExpiry: "", // Number of days download is valid after purchase
    maxDownloads: "", // Maximum number of downloads allowed
    paymentGateway: "PhonePe", // Default payment gateway
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!db) return

        const productDoc = await getDoc(doc(db, "products", params.slug))
        if (productDoc.exists()) {
          const data = productDoc.data()
          setProductData({
            ...data,
            price: data.price.toString(),
            originalPrice: data.originalPrice ? data.originalPrice.toString() : "",
            downloadExpiry: data.downloadExpiry ? data.downloadExpiry.toString() : "",
            maxDownloads: data.maxDownloads ? data.maxDownloads.toString() : "",
            paymentGateway: data.paymentGateway || "PhonePe",
          })
        } else {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          })
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug, db, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Auto-generate slug when title changes
    if (name === "title") {
      setProductData({
        ...productData,
        title: value,
        slug: generateSlug(value),
      })
    } else {
      setProductData({
        ...productData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setProductData({
      ...productData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProductData({
      ...productData,
      [name]: checked ? "Active" : "Draft",
    })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...productData.features]
    updatedFeatures[index] = value
    setProductData({
      ...productData,
      features: updatedFeatures,
    })
  }

  const addFeature = () => {
    setProductData({
      ...productData,
      features: [...productData.features, ""],
    })
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...productData.features]
    updatedFeatures.splice(index, 1)
    setProductData({
      ...productData,
      features: updatedFeatures,
    })
  }

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const updatedFaqs = [...productData.faqs]
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value }
    setProductData({
      ...productData,
      faqs: updatedFaqs,
    })
  }

  const addFaq = () => {
    setProductData({
      ...productData,
      faqs: [...productData.faqs, { question: "", answer: "" }],
    })
  }

  const removeFaq = (index: number) => {
    const updatedFaqs = [...productData.faqs]
    updatedFaqs.splice(index, 1)
    setProductData({
      ...productData,
      faqs: updatedFaqs,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (
        !productData.title ||
        !productData.description ||
        !productData.price ||
        !productData.category ||
        !productData.image
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Format data for Firestore
      const productToSave = {
        ...productData,
        price: Number.parseFloat(productData.price),
        originalPrice: productData.originalPrice ? Number.parseFloat(productData.originalPrice) : null,
        downloadExpiry: productData.downloadExpiry ? Number.parseInt(productData.downloadExpiry) : null,
        maxDownloads: productData.maxDownloads ? Number.parseInt(productData.maxDownloads) : null,
        features: productData.features.filter((feature) => feature.trim() !== ""),
        faqs: productData.faqs.filter((faq) => faq.question.trim() !== "" && faq.answer.trim() !== ""),
        updatedAt: new Date().toISOString(),
      }

      if (!db) {
        throw new Error("Firebase is not initialized")
      }

      await updateDoc(doc(db, "products", params.slug), productToSave)

      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      // Redirect to products list
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <p className="text-center">Loading product data...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Edit Product</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:border-blue-300" asChild>
              <Link href={`/products/${productData.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Product
              </Link>
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Update Product"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="bg-blue-50 border-blue-100">
            <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Details
            </TabsTrigger>
            <TabsTrigger value="faqs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              FAQs
            </TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Downloads
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Edit the basic information about your digital product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Product Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Digital Marketing Blueprint"
                      className="border-blue-200"
                      value={productData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="auto-generated-from-title"
                      className="border-blue-200"
                      value={productData.slug}
                      onChange={handleInputChange}
                      disabled
                    />
                    <p className="text-xs text-gray-500">Auto-generated from title</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your product in detail"
                    className="min-h-32 border-blue-200"
                    value={productData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="e.g. 499"
                      className="border-blue-200"
                      value={productData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      placeholder="e.g. 999"
                      className="border-blue-200"
                      value={productData.originalPrice}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500">Leave empty if no discount</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={productData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ebooks">Ebooks</SelectItem>
                        <SelectItem value="Courses">Courses</SelectItem>
                        <SelectItem value="Templates">Templates</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">
                    Product Image URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    className="border-blue-200"
                    value={productData.image}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500">Enter a URL for the product image</p>
                </div>

                {productData.image && (
                  <div className="border border-blue-200 rounded-md p-4 flex items-center justify-center">
                    <div className="relative h-40 w-40">
                      <Image
                        src={productData.image || "/placeholder.svg"}
                        alt="Product preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="paymentGateway">Payment Gateway</Label>
                  <Select
                    value={productData.paymentGateway}
                    onValueChange={(value) => handleSelectChange("paymentGateway", value)}
                  >
                    <SelectTrigger className="border-blue-200">
                      <SelectValue placeholder="Select payment gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PhonePe">PhonePe</SelectItem>
                      <SelectItem value="Cashfree">Cashfree</SelectItem>
                      <SelectItem value="Both">Both (Customer Choice)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={productData.status === "Active"}
                    onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                  />
                  <Label htmlFor="status">{productData.status === "Active" ? "Active" : "Draft"}</Label>
                  <p className="text-xs text-gray-500 ml-2">
                    {productData.status === "Active" ? "Product is visible to customers" : "Product is saved as draft"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Edit features and additional details about your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>What You'll Get</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFeature}
                      className="border-blue-200 text-blue-600 hover:border-blue-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>

                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="border-blue-200"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                        disabled={productData.features.length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyNowLink">Buy Now Link</Label>
                  <Input
                    id="buyNowLink"
                    name="buyNowLink"
                    placeholder="https://example.com/checkout"
                    className="border-blue-200"
                    value={productData.buyNowLink}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500">
                    Optional external link for the "Buy Now" button (e.g., for payment processor)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Edit FAQs to help customers understand your product better.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>FAQs</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFaq}
                      className="border-blue-200 text-blue-600 hover:border-blue-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>

                  {productData.faqs.map((faq, index) => (
                    <div key={index} className="space-y-2 border border-blue-100 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <Label>FAQ #{index + 1}</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFaq(index)}
                          disabled={productData.faqs.length === 1}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                      <Input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                        className="border-blue-200 mb-2"
                      />
                      <Textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                        className="min-h-20 border-blue-200"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Download Settings</CardTitle>
                <CardDescription>Configure download options for your digital product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="downloadLink">
                      Download Link <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="downloadLink"
                        name="downloadLink"
                        placeholder="https://example.com/files/product.zip"
                        className="border-blue-200 flex-1"
                        value={productData.downloadLink}
                        onChange={handleInputChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(productData.downloadLink)}
                        className="border-blue-200"
                        disabled={!productData.downloadLink}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Direct link to your digital product file. This will be provided to customers after purchase.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="downloadExpiry">Download Expiry (Days)</Label>
                      <Input
                        id="downloadExpiry"
                        name="downloadExpiry"
                        type="number"
                        placeholder="e.g. 30"
                        className="border-blue-200"
                        value={productData.downloadExpiry}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-gray-500">
                        Number of days the download link remains valid. Leave empty for no expiry.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxDownloads">Maximum Downloads</Label>
                      <Input
                        id="maxDownloads"
                        name="maxDownloads"
                        type="number"
                        placeholder="e.g. 3"
                        className="border-blue-200"
                        value={productData.maxDownloads}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-gray-500">
                        Maximum number of times a customer can download the file. Leave empty for unlimited.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                    <h4 className="text-sm font-medium text-amber-800 mb-2">Important Notes</h4>
                    <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
                      <li>Ensure your download link is secure and not publicly accessible.</li>
                      <li>For large files, consider using a cloud storage service with expiring links.</li>
                      <li>
                        If your product is updated, you can change the download link here and existing customers will
                        get the new version.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-between border rounded-md border-blue-100 bg-blue-50 p-4">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:border-blue-300" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Update Product"}
          </Button>
        </CardFooter>
      </div>
    </AdminLayout>
  )
}
