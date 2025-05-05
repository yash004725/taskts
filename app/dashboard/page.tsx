import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardPage() {
  // Sample purchased products
  const purchasedProducts = [
    {
      id: 1,
      title: "The Game Changer Scaling Ebook",
      description: "Master Facebook Ads strategies used by top experts",
      price: 299,
      purchaseDate: "2023-04-15",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      title: "SEO Toolkit Bundle",
      description: "Premium SEO tools and templates for professionals",
      price: 399,
      purchaseDate: "2023-03-22",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // Sample invoices
  const invoices = [
    { id: "INV-001", date: "Apr 15, 2023", amount: 299, status: "Paid" },
    { id: "INV-002", date: "Mar 22, 2023", amount: 399, status: "Paid" },
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹698</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Purchased</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">+2 in the last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {purchasedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-6">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm text-gray-500">Purchased on {product.purchaseDate}</p>
                      </div>
                    </div>
                    <div className="bg-muted p-4 flex justify-between items-center">
                      <p className="text-sm text-gray-500">Purchase ID: #{product.id}</p>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>View and download your purchase invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{invoice.amount}</p>
                        <p className="text-sm text-green-600">{invoice.status}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p>Rahul Sharma</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>rahul.sharma@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>+91 98765 43210</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit Profile
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Password & Security</h3>
                  <p className="text-sm text-gray-500">Last password change: 3 months ago</p>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Email Preferences</h3>
                  <p className="text-sm text-gray-500">Manage your email notification preferences</p>
                  <Button variant="outline" size="sm">
                    Manage Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
