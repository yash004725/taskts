"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus, Trash, ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AdminLayout from "@/components/admin-layout"
import { useFirebase } from "@/lib/firebase-context"
import { generateSlug } from "@/lib/utils"
import { collection, addDoc } from "firebase/firestore"

export default function NewProductPage() {
  const router = useRouter()
  const { db } = useFirebase()
  const { toast } = useToast()

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
  })

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
        features: productData.features.filter((feature) => feature.trim() !== ""),
        faqs: productData.faqs.filter((faq) => faq.question.trim() !== "" && faq.answer.trim() !== ""),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 5.0, // Default rating for new products
      }

      if (!db) {
        throw new Error("Firebase is not initialized")
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "products"), productToSave)
      console.log("Product created with ID:", docRef.id)

      toast({
        title: "Success",
        description: "Product created successfully",
      })

      // Redirect to products list
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
            <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Add New Product</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:border-blue-300"
              disabled={!productData.title || !productData.description || !productData.image}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Product"}
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
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Enter the basic information about your digital product.</CardDescription>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={productData.status === "Active"}
                    onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                  />
                  <Label htmlFor="status">{productData.status === "Active" ? "Active" : "Draft"}</Label>
                  <p className="text-xs text-gray-500 ml-2">
                    {productData.status === "Active"
                      ? "Product will be visible to customers"
                      : "Product will be saved as draft"}
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
                <CardDescription>Add features and additional details about your product.</CardDescription>
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
                <CardDescription>Add FAQs to help customers understand your product better.</CardDescription>
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
        </Tabs>

        <CardFooter className="flex justify-between border rounded-md border-blue-100 bg-blue-50 p-4">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:border-blue-300" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </CardFooter>
      </div>
    </AdminLayout>
  )
}
