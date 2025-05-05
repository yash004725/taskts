"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Plus, Search, Trash, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AdminLayout from "@/components/admin-layout"
import { useFirebase } from "@/lib/firebase-context"
import { collection, getDocs } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"

export default function AdminProductsPage() {
  const { db } = useFirebase()
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products")
        const productsSnapshot = await getDocs(productsCollection)
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setProducts(productsList)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, use sample data
    // In a real app, uncomment the fetchProducts() call
    // fetchProducts()

    // Sample data for demo
    setTimeout(() => {
      setProducts([
        {
          id: "1",
          title: "The Digital Marketing Blueprint",
          price: 499,
          originalPrice: 999,
          category: "Ebooks",
          status: "Active",
          sales: 42,
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000",
          slug: "digital-marketing-blueprint",
        },
        {
          id: "2",
          title: "Social Media Growth Masterclass",
          price: 799,
          originalPrice: 1299,
          category: "Courses",
          status: "Active",
          sales: 38,
          image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000",
          slug: "social-media-growth-masterclass",
        },
        {
          id: "3",
          title: "SEO Toolkit Bundle",
          price: 399,
          category: "Tools",
          status: "Active",
          sales: 27,
          image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1000",
          slug: "seo-toolkit-bundle",
        },
        {
          id: "4",
          title: "Content Calendar Template",
          price: 199,
          originalPrice: 299,
          category: "Templates",
          status: "Active",
          sales: 24,
          image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1000",
          slug: "content-calendar-template",
        },
        {
          id: "5",
          title: "Email Marketing Guide",
          price: 349,
          category: "Ebooks",
          status: "Draft",
          sales: 0,
          image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1000",
          slug: "email-marketing-guide",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [db, toast])

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // In a real app, uncomment this
        // await deleteDoc(doc(db, "products", id))

        // Update local state
        setProducts(products.filter((product) => product.id !== id))

        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Products</h2>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 border-blue-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:border-blue-300">
            Filter
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No products found</p>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/admin/products/new">Add Your First Product</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-blue-100">
                    <TableCell>
                      <div className="relative h-10 w-10">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-blue-700">{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === "Active" ? "default" : "secondary"}
                        className={product.status === "Active" ? "bg-green-600" : "bg-gray-500"}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.slug}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
