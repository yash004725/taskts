"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useFirebase } from "@/lib/firebase-context"

export default function CompanyDetailsPage() {
  const { db } = useFirebase()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyData, setCompanyData] = useState({
    name: "",
    tagline: "",
    description: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  })

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // In a real app, uncomment this
        // const companyDoc = await getDoc(doc(db, "settings", "company"))
        // if (companyDoc.exists()) {
        //   setCompanyData(companyDoc.data())
        // }

        // For demo purposes, use sample data
        setTimeout(() => {
          setCompanyData({
            name: "XDigitalHub",
            tagline: "Premium Digital Products for Modern Creators",
            description:
              "XDigitalHub is a leading marketplace for high-quality digital products including ebooks, courses, templates, and tools. We help creators and businesses grow with premium resources.",
            logo: "https://example.com/logo.png",
            email: "contact@xdigitalhub.com",
            phone: "+91 98765 43210",
            address: "123 Digital Street, Bangalore, India 560001",
            socialLinks: {
              facebook: "https://facebook.com/xdigitalhub",
              twitter: "https://twitter.com/xdigitalhub",
              instagram: "https://instagram.com/xdigitalhub",
              linkedin: "https://linkedin.com/company/xdigitalhub",
            },
          })

          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching company details:", error)
        toast({
          title: "Error",
          description: "Failed to load company details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanyDetails()
  }, [db, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setCompanyData({
        ...companyData,
        [parent]: {
          ...companyData[parent as keyof typeof companyData],
          [child]: value,
        },
      })
    } else {
      setCompanyData({
        ...companyData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!companyData.name || !companyData.email) {
        throw new Error("Company name and email are required")
      }

      // In a real app, uncomment this
      // await setDoc(doc(db, "settings", "company"), companyData)

      toast({
        title: "Success",
        description: "Company details updated successfully",
      })
    } catch (error: any) {
      console.error("Error updating company details:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update company details. Please try again.",
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
          <p className="text-center">Loading company details...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Company Details</h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your company's basic information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="border-blue-200"
                    value={companyData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    name="tagline"
                    className="border-blue-200"
                    value={companyData.tagline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  className="min-h-32 border-blue-200"
                  value={companyData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  className="border-blue-200"
                  value={companyData.logo}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">Enter a URL for your company logo</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your company's contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="border-blue-200"
                    value={companyData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    className="border-blue-200"
                    value={companyData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  className="border-blue-200"
                  value={companyData.address}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Update your company's social media links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.facebook">Facebook</Label>
                  <Input
                    id="socialLinks.facebook"
                    name="socialLinks.facebook"
                    className="border-blue-200"
                    value={companyData.socialLinks.facebook}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.twitter">Twitter</Label>
                  <Input
                    id="socialLinks.twitter"
                    name="socialLinks.twitter"
                    className="border-blue-200"
                    value={companyData.socialLinks.twitter}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.instagram">Instagram</Label>
                  <Input
                    id="socialLinks.instagram"
                    name="socialLinks.instagram"
                    className="border-blue-200"
                    value={companyData.socialLinks.instagram}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.linkedin">LinkedIn</Label>
                  <Input
                    id="socialLinks.linkedin"
                    name="socialLinks.linkedin"
                    className="border-blue-200"
                    value={companyData.socialLinks.linkedin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
