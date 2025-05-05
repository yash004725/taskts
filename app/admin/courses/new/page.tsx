"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db, storage } from "@/lib/firebase-config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminAuthCheck } from "@/components/admin-auth-check"

export default function NewCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    slug: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      let imageUrl = formData.imageUrl

      // If a file was selected, upload it to Firebase Storage
      if (imageFile) {
        const storageRef = ref(storage, `courses/${Date.now()}-${imageFile.name}`)
        const uploadResult = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(uploadResult.ref)
      }

      // Add course to Firestore
      const courseData = {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price) || 0,
        imageUrl,
        slug: formData.slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "courses"), courseData)

      // Redirect to the courses list
      router.push("/admin/courses")
      router.refresh()
    } catch (error) {
      console.error("Error creating course:", error)
      setError("An error occurred while creating the course. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <AdminAuthCheck>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Enter the details for the new course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="course-slug"
                  required
                />
                <p className="text-sm text-gray-500">This will be used in the URL (e.g., /courses/course-slug)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="999.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageFile">Course Image</Label>
                <Input id="imageFile" type="file" onChange={handleImageChange} accept="image/*" />
                <p className="text-sm text-gray-500">Upload an image for the course</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Or Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500">Alternatively, provide a URL to an existing image</p>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AdminAuthCheck>
  )
}
