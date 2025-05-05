"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useFirebase } from "@/lib/firebase-context"
import { useAuth } from "@/lib/auth-context"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { formatPrice } from "@/lib/utils"

export default function DownloadsPage() {
  const { db } = useFirebase()
  const { user } = useAuth()
  const { toast } = useToast()
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!db || !user) return

      try {
        const purchasesQuery = query(collection(db, "purchases"), where("userId", "==", user.uid))

        const purchasesSnapshot = await getDocs(purchasesQuery)
        const purchasesList = purchasesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          purchaseDate: doc.data().purchaseDate?.toDate?.() || new Date(),
          expiryDate: doc.data().expiryDate?.toDate?.() || null,
        }))

        setPurchases(purchasesList)
      } catch (error) {
        console.error("Error fetching purchases:", error)
        toast({
          title: "Error",
          description: "Failed to load your purchases. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [db, user, toast])

  const handleDownload = async (purchaseId: string, downloadLink: string) => {
    if (!downloadLink) {
      toast({
        title: "Error",
        description: "Download link not available. Please contact support.",
        variant: "destructive",
      })
      return
    }

    try {
      // Update download count
      if (db) {
        const purchaseRef = doc(db, "purchases", purchaseId)
        await updateDoc(purchaseRef, {
          downloadCount: purchases.find((p) => p.id === purchaseId).downloadCount + 1,
          lastDownloadDate: new Date().toISOString(),
        })
      }

      // Open download link in new tab
      window.open(downloadLink, "_blank")

      toast({
        title: "Download started",
        description: "Your download should begin shortly.",
      })
    } catch (error) {
      console.error("Error processing download:", error)
      toast({
        title: "Error",
        description: "Failed to process download. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isDownloadExpired = (purchase: any) => {
    if (!purchase.expiryDate) return false
    return new Date() > purchase.expiryDate
  }

  const hasReachedMaxDownloads = (purchase: any) => {
    if (!purchase.maxDownloads) return false
    return purchase.downloadCount >= purchase.maxDownloads
  }

  const getDownloadStatus = (purchase: any) => {
    if (isDownloadExpired(purchase)) {
      return {
        status: "expired",
        label: "Expired",
        color: "bg-red-600",
      }
    }

    if (hasReachedMaxDownloads(purchase)) {
      return {
        status: "limit-reached",
        label: "Limit Reached",
        color: "bg-amber-600",
      }
    }

    return {
      status: "available",
      label: "Available",
      color: "bg-green-600",
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Downloads</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Downloads</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <p className="text-center py-8">Loading your downloads...</p>
          ) : purchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't purchased any downloadable products yet.</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases.map((purchase) => {
                const downloadStatus = getDownloadStatus(purchase)

                return (
                  <Card key={purchase.id} className="overflow-hidden">
                    <div className="relative h-40 w-full">
                      <Image
                        src={purchase.productImage || "/placeholder.svg"}
                        alt={purchase.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{purchase.productName}</CardTitle>
                        <Badge className={downloadStatus.color}>{downloadStatus.label}</Badge>
                      </div>
                      <CardDescription>Purchased on {purchase.purchaseDate.toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Price:</span>
                          <span>{formatPrice(purchase.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Downloads:</span>
                          <span>
                            {purchase.downloadCount || 0} {purchase.maxDownloads ? `/ ${purchase.maxDownloads}` : ""}
                          </span>
                        </div>
                        {purchase.expiryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expires:</span>
                            <span className={isDownloadExpired(purchase) ? "text-red-600" : ""}>
                              {purchase.expiryDate.toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleDownload(purchase.id, purchase.downloadLink)}
                        disabled={downloadStatus.status !== "available" || !purchase.downloadLink}
                      >
                        {downloadStatus.status === "available" ? (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </>
                        ) : downloadStatus.status === "expired" ? (
                          <>
                            <Clock className="mr-2 h-4 w-4" />
                            Expired
                          </>
                        ) : (
                          <>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Limit Reached
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {loading ? (
            <p className="text-center py-8">Loading your downloads...</p>
          ) : purchases.filter((p) => !isDownloadExpired(p) && !hasReachedMaxDownloads(p)).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have any available downloads.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases
                .filter((p) => !isDownloadExpired(p) && !hasReachedMaxDownloads(p))
                .map((purchase) => (
                  <Card key={purchase.id} className="overflow-hidden">
                    {/* Same card content as above */}
                    <div className="relative h-40 w-full">
                      <Image
                        src={purchase.productImage || "/placeholder.svg"}
                        alt={purchase.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{purchase.productName}</CardTitle>
                        <Badge className="bg-green-600">Available</Badge>
                      </div>
                      <CardDescription>Purchased on {purchase.purchaseDate.toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Price:</span>
                          <span>{formatPrice(purchase.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Downloads:</span>
                          <span>
                            {purchase.downloadCount || 0} {purchase.maxDownloads ? `/ ${purchase.maxDownloads}` : ""}
                          </span>
                        </div>
                        {purchase.expiryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expires:</span>
                            <span>{purchase.expiryDate.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleDownload(purchase.id, purchase.downloadLink)}
                        disabled={!purchase.downloadLink}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {loading ? (
            <p className="text-center py-8">Loading your downloads...</p>
          ) : purchases.filter((p) => isDownloadExpired(p) || hasReachedMaxDownloads(p)).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have any expired downloads.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases
                .filter((p) => isDownloadExpired(p) || hasReachedMaxDownloads(p))
                .map((purchase) => {
                  const downloadStatus = getDownloadStatus(purchase)

                  return (
                    <Card key={purchase.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image
                          src={purchase.productImage || "/placeholder.svg"}
                          alt={purchase.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{purchase.productName}</CardTitle>
                          <Badge className={downloadStatus.color}>{downloadStatus.label}</Badge>
                        </div>
                        <CardDescription>Purchased on {purchase.purchaseDate.toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Price:</span>
                            <span>{formatPrice(purchase.amount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Downloads:</span>
                            <span>
                              {purchase.downloadCount || 0} {purchase.maxDownloads ? `/ ${purchase.maxDownloads}` : ""}
                            </span>
                          </div>
                          {purchase.expiryDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expires:</span>
                              <span className="text-red-600">{purchase.expiryDate.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" disabled={true}>
                          {isDownloadExpired(purchase) ? (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              Expired
                            </>
                          ) : (
                            <>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Limit Reached
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
