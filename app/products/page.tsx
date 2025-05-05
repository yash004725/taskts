import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Search, SlidersHorizontal } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ProductsPage() {
  // Sample products data
  const products = [
    {
      id: 1,
      title: "The Game Changer Scaling Ebook",
      description: "Master Facebook Ads strategies used by top experts",
      price: 299,
      image: "/placeholder.svg?height=300&width=300",
      category: "Ebooks",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      description: "Complete guide to digital marketing in 2024",
      price: 499,
      image: "/placeholder.svg?height=300&width=300",
      category: "Courses",
      rating: 4.9,
    },
    {
      id: 3,
      title: "SEO Toolkit Bundle",
      description: "Premium SEO tools and templates for professionals",
      price: 399,
      image: "/placeholder.svg?height=300&width=300",
      category: "Tools",
      rating: 4.7,
    },
    {
      id: 4,
      title: "Social Media Content Calendar",
      description: "12-month content planning template",
      price: 199,
      image: "/placeholder.svg?height=300&width=300",
      category: "Templates",
      rating: 4.6,
    },
    {
      id: 5,
      title: "Email Marketing Automation Guide",
      description: "Learn how to set up effective email marketing campaigns",
      price: 349,
      image: "/placeholder.svg?height=300&width=300",
      category: "Ebooks",
      rating: 4.5,
    },
    {
      id: 6,
      title: "Canva Pro Templates Bundle",
      description: "100+ premium Canva templates for social media and marketing",
      price: 249,
      image: "/placeholder.svg?height=300&width=300",
      category: "Templates",
      rating: 4.8,
    },
    {
      id: 7,
      title: "YouTube Channel Growth Strategy",
      description: "Step-by-step guide to grow your YouTube channel",
      price: 399,
      image: "/placeholder.svg?height=300&width=300",
      category: "Courses",
      rating: 4.7,
    },
    {
      id: 8,
      title: "Affiliate Marketing Blueprint",
      description: "Complete system to succeed with affiliate marketing",
      price: 499,
      image: "/placeholder.svg?height=300&width=300",
      category: "Ebooks",
      rating: 4.9,
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-gray-500">Showing {products.length} products</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search products..." className="pl-9 w-full md:w-64" />
            </div>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <Card className="hidden md:block h-fit sticky top-20">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-3">
                    {["All", "Ebooks", "Courses", "Templates", "Tools"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <Slider defaultValue={[0, 1000]} max={1000} step={1} className="mb-6" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm">₹0</div>
                    <div className="text-sm">₹1000</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Ratings</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {rating} Stars & Above
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Filters - Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden mb-4 w-full flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="space-y-6 py-6">
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-3">
                    {["All", "Ebooks", "Courses", "Templates", "Tools"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-category-${category}`} />
                        <label
                          htmlFor={`mobile-category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <Slider defaultValue={[0, 1000]} max={1000} step={1} className="mb-6" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm">₹0</div>
                    <div className="text-sm">₹1000</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Ratings</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-rating-${rating}`} />
                        <label
                          htmlFor={`mobile-rating-${rating}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {rating} Stars & Above
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
