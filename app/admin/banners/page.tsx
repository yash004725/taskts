"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash, Edit, Loader2 } from "lucide-react"
import Image from "next/image"
import AdminLayout from "@/components/admin-layout"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface Banner {
  id: string
  title: string
  imageUrl: string
  link: string
  position: string
  active: boolean
  createdAt?: any
  updatedAt?: any
}

export default function BannersPage() {
  const { toast } = useToast()

  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newBanner, setNewBanner] = useState<Omit<Banner, "id">>({
    title: "",
    imageUrl: "",
    link: "",
    position: "home_top",
    active: true,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Listen for banners from Firestore
  useEffect(() => {
    const bannersQuery = query(collection(db, "banners"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      bannersQuery,
      (snapshot) => {
        const bannersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Banner[]

        setBanners(bannersList)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error listening to banners:", error)
        toast({
          title: "Error",
          description: "Failed to load banners. Please refresh the page.",
          variant: "destructive",
        })
        setIsLoading(false)
      },
    )

    // Log activity
    const logActivity = async () => {
      try {
        await addDoc(collection(db, "activity"), {
          action: "Viewed banners page",
          userId: localStorage.getItem("adminUid"),
          timestamp: serverTimestamp(),
        })
      } catch (error) {
        console.error("Error logging activity:", error)
      }
    }

    logActivity()

    return () => unsubscribe()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (editingBanner) {
      setEditingBanner({
        ...editingBanner,
        [name]: value,
      })
    } else {
      setNewBanner((prev) => ({ ...prev, [name]: value }))
    }

    // Update image preview when imageUrl changes
    if (name === "imageUrl" && value) {
      setImagePreview(value)
    }
  }

  const handlePositionChange = (position: string) => {
    if (editingBanner) {
      setEditingBanner({
        ...editingBanner,
        position,
      })
    } else {
      setNewBanner((prev) => ({ ...prev, position }))
    }
  }

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingBanner) {
      setEditingBanner({
        ...editingBanner,
        active: e.target.checked,
      })
    } else {
      setNewBanner((prev) => ({ ...prev, active: e.target.checked }))
    }
  }

  const validateImageUrl = () => {
    const imageUrl = editingBanner ? editingBanner.imageUrl : newBanner.imageUrl

    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    // Create a test image to check if URL is valid
    const img = new Image()
    img.onload = () => {
      setImagePreview(imageUrl)
      toast({
        title: "Success",
        description: "Image URL is valid",
      })
    }
    img.onerror = () => {
      toast({
        title: "Error",
        description: "Invalid image URL. Please check the URL and try again.",
        variant: "destructive",
      })
      setImagePreview(null)
    }
    img.src = imageUrl
  }

  const handleAddBanner = async () => {
    try {
      setIsSubmitting(true)

      if (!newBanner.title || !newBanner.imageUrl) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Add banner to Firestore
      await addDoc(collection(db, "banners"), {
        ...newBanner,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Log activity
      await addDoc(collection(db, "activity"), {
        action: `Added new banner: ${newBanner.title}`,
        userId: localStorage.getItem("adminUid"),
        timestamp: serverTimestamp(),
      })

      // Reset form
      setNewBanner({
        title: "",
        imageUrl: "",
        link: "",
        position: "home_top",
        active: true,
      })
      setImagePreview(null)
      setActiveTab("all")

      toast({
        title: "Success",
        description: "Banner added successfully",
      })
    } catch (error) {
      console.error("Error adding banner:", error)
      toast({
        title: "Error",
        description: "Failed to add banner. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateBanner = async () => {
    try {
      setIsSubmitting(true)

      if (!editingBanner || !editingBanner.title || !editingBanner.imageUrl) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Update banner in Firestore
      await updateDoc(doc(db, "banners", editingBanner.id), {
        ...editingBanner,
        updatedAt: serverTimestamp(),
      })

      // Log activity
      await addDoc(collection(db, "activity"), {
        action: `Updated banner: ${editingBanner.title}`,
        userId: localStorage.getItem("adminUid"),
        timestamp: serverTimestamp(),
      })

      // Reset form
      setEditingBanner(null)
      setImagePreview(null)
      setActiveTab("all")

      toast({
        title: "Success",
        description: "Banner updated successfully",
      })
    } catch (error) {
      console.error("Error updating banner:", error)
      toast({
        title: "Error",
        description: "Failed to update banner. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBanner = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the banner "${title}"?`)) {
      try {
        // Delete banner from Firestore
        await deleteDoc(doc(db, "banners", id))

        // Log activity
        await addDoc(collection(db, "activity"), {
          action: `Deleted banner: ${title}`,
          userId: localStorage.getItem("adminUid"),
          timestamp: serverTimestamp(),
        })

        toast({
          title: "Success",
          description: "Banner deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting banner:", error)
        toast({
          title: "Error",
          description: "Failed to delete banner. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setImagePreview(banner.imageUrl)
    setActiveTab("edit")
  }

  const cancelEdit = () => {
    setEditingBanner(null)
    setImagePreview(null)
    setActiveTab("all")
  }

  if (!isClient) {
    return null
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Banner Management</h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setActiveTab("add")
              setEditingBanner(null)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Banner
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-blue-50 border-blue-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              All Banners
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Add New Banner
            </TabsTrigger>
            {editingBanner && (
              <TabsTrigger value="edit" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Edit Banner
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                <p className="mt-2 text-gray-500">Loading banners...</p>
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No banners found</p>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("add")}>
                  Add Your First Banner
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <Card key={banner.id} className="border-blue-100">
                    <div className="relative h-48 w-full">
                      <Image
                        src={banner.imageUrl || "/placeholder.svg?height=200&width=400"}
                        alt={banner.title}
                        fill
                        className="object-cover rounded-t-md"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=400"
                        }}
                      />
                      {!banner.active && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Inactive
                          </span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{banner.title}</CardTitle>
                      <CardDescription>
                        Position: {banner.position.replace("_", " ")} | Status: {banner.active ? "Active" : "Inactive"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm truncate">Link: {banner.link}</p>
                      {banner.createdAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Created: {new Date(banner.createdAt.toDate()).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteBanner(banner.id, banner.title)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleEditBanner(banner)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Add New Banner</CardTitle>
                <CardDescription>Create a new banner to display on your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Banner Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Special Offer"
                    className="border-blue-200"
                    value={newBanner.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">
                    Image URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      className="border-blue-200 flex-1"
                      value={newBanner.imageUrl}
                      onChange={handleInputChange}
                    />
                    <Button type="button" onClick={validateImageUrl} className="bg-blue-600">
                      Validate
                    </Button>
                  </div>
                </div>

                {imagePreview && (
                  <div className="border border-blue-200 rounded-md p-4 flex items-center justify-center">
                    <div className="relative h-40 w-full">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Banner preview"
                        fill
                        className="object-cover rounded-md"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=400"
                          setImagePreview(null)
                          toast({
                            title: "Error",
                            description: "Failed to load image. Please check the URL.",
                            variant: "destructive",
                          })
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    name="link"
                    placeholder="e.g. /products/special-offer"
                    className="border-blue-200"
                    value={newBanner.link}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={newBanner.position === "home_top" ? "default" : "outline"}
                      className={newBanner.position === "home_top" ? "bg-blue-600" : "border-blue-200"}
                      onClick={() => handlePositionChange("home_top")}
                    >
                      Home Top
                    </Button>
                    <Button
                      type="button"
                      variant={newBanner.position === "home_middle" ? "default" : "outline"}
                      className={newBanner.position === "home_middle" ? "bg-blue-600" : "border-blue-200"}
                      onClick={() => handlePositionChange("home_middle")}
                    >
                      Home Middle
                    </Button>
                    <Button
                      type="button"
                      variant={newBanner.position === "products_top" ? "default" : "outline"}
                      className={newBanner.position === "products_top" ? "bg-blue-600" : "border-blue-200"}
                      onClick={() => handlePositionChange("products_top")}
                    >
                      Products Top
                    </Button>
                    <Button
                      type="button"
                      variant={newBanner.position === "sidebar" ? "default" : "outline"}
                      className={newBanner.position === "sidebar" ? "bg-blue-600" : "border-blue-200"}
                      onClick={() => handlePositionChange("sidebar")}
                    >
                      Sidebar
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={newBanner.active}
                    onChange={handleActiveChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("all")
                    setImagePreview(null)
                  }}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddBanner} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Banner
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            {editingBanner && (
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Edit Banner</CardTitle>
                  <CardDescription>Update banner details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">
                      Banner Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-title"
                      name="title"
                      placeholder="e.g. Special Offer"
                      className="border-blue-200"
                      value={editingBanner.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-imageUrl">
                      Image URL <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="edit-imageUrl"
                        name="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        className="border-blue-200 flex-1"
                        value={editingBanner.imageUrl}
                        onChange={handleInputChange}
                      />
                      <Button type="button" onClick={validateImageUrl} className="bg-blue-600">
                        Validate
                      </Button>
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="border border-blue-200 rounded-md p-4 flex items-center justify-center">
                      <div className="relative h-40 w-full">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Banner preview"
                          fill
                          className="object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=200&width=400"
                            setImagePreview(null)
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="edit-link">Link URL</Label>
                    <Input
                      id="edit-link"
                      name="link"
                      placeholder="e.g. /products/special-offer"
                      className="border-blue-200"
                      value={editingBanner.link}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={editingBanner.position === "home_top" ? "default" : "outline"}
                        className={editingBanner.position === "home_top" ? "bg-blue-600" : "border-blue-200"}
                        onClick={() => handlePositionChange("home_top")}
                      >
                        Home Top
                      </Button>
                      <Button
                        type="button"
                        variant={editingBanner.position === "home_middle" ? "default" : "outline"}
                        className={editingBanner.position === "home_middle" ? "bg-blue-600" : "border-blue-200"}
                        onClick={() => handlePositionChange("home_middle")}
                      >
                        Home Middle
                      </Button>
                      <Button
                        type="button"
                        variant={editingBanner.position === "products_top" ? "default" : "outline"}
                        className={editingBanner.position === "products_top" ? "bg-blue-600" : "border-blue-200"}
                        onClick={() => handlePositionChange("products_top")}
                      >
                        Products Top
                      </Button>
                      <Button
                        type="button"
                        variant={editingBanner.position === "sidebar" ? "default" : "outline"}
                        className={editingBanner.position === "sidebar" ? "bg-blue-600" : "border-blue-200"}
                        onClick={() => handlePositionChange("sidebar")}
                      >
                        Sidebar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-active"
                      checked={editingBanner.active}
                      onChange={handleActiveChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="edit-active">Active</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleUpdateBanner}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Banner
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
