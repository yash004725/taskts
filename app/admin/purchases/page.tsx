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
import { MoreHorizontal, Search, Download, RefreshCw, Eye, XCircle } from "lucide-react"
import Link from "next/link"
import AdminLayout from "@/components/admin-layout"
import { useFirebase } from "@/lib/firebase-context"
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"

export default function AdminPurchasesPage() {
  const { db } = useFirebase()
  const { toast } = useToast()
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        if (!db) return

        const purchasesQuery = query(collection(db, "purchases"), orderBy("purchaseDate", "desc"))

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
          description: "Failed to load purchases. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [db, toast])

  const handleResetDownloadCount = async (purchaseId: string) => {
    try {
      if (!db) return

      await updateDoc(doc(db, "purchases", purchaseId), {
        downloadCount: 0,
        lastResetDate: new Date().toISOString(),
      })

      // Update local state
      setPurchases(
        purchases.map((purchase) =>
          purchase.id === purchaseId ? { ...purchase, downloadCount: 0, lastResetDate: new Date() } : purchase,
        ),
      )

      toast({
        title: "Success",
        description: "Download count reset successfully",
      })
    } catch (error) {
      console.error("Error resetting download count:", error)
      toast({
        title: "Error",
        description: "Failed to reset download count. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExtendExpiry = async (purchaseId: string) => {
    try {
      if (!db) return

      // Extend by 30 days from now
      const newExpiryDate = new Date()
      newExpiryDate.setDate(newExpiryDate.getDate() + 30)

      await updateDoc(doc(db, "purchases", purchaseId), {
        expiryDate: newExpiryDate.toISOString(),
      })

      // Update local state
      setPurchases(
        purchases.map((purchase) =>
          purchase.id === purchaseId ? { ...purchase, expiryDate: newExpiryDate } : purchase,
        ),
      )

      toast({
        title: "Success",
        description: "Expiry date extended by 30 days",
      })
    } catch (error) {
      console.error("Error extending expiry:", error)
      toast({
        title: "Error",
        description: "Failed to extend expiry date. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRevokeAccess = async (purchaseId: string) => {
    if (window.confirm("Are you sure you want to revoke access to this purchase?")) {
      try {
        if (!db) return

        await updateDoc(doc(db, "purchases", purchaseId), {
          status: "REVOKED",
          revokedAt: new Date().toISOString(),
        })

        // Update local state
        setPurchases(
          purchases.map((purchase) =>
            purchase.id === purchaseId ? { ...purchase, status: "REVOKED", revokedAt: new Date() } : purchase,
          ),
        )

        toast({
          title: "Success",
          description: "Access revoked successfully",
        })
      } catch (error) {
        console.error("Error revoking access:", error)
        toast({
          title: "Error",
          description: "Failed to revoke access. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredPurchases = searchQuery
    ? purchases.filter(
        (purchase) =>
          purchase.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          purchase.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          purchase.merchantTransactionId?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : purchases

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Purchases & Downloads</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search purchases..."
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
          <div className="text-center py-8">Loading purchases...</div>
        ) : filteredPurchases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No purchases found</p>
          </div>
        ) : (
          <div className="rounded-md border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => {
                  const isExpired = purchase.expiryDate && new Date() > purchase.expiryDate
                  const isRevoked = purchase.status === "REVOKED"
                  const hasReachedLimit = purchase.maxDownloads && purchase.downloadCount >= purchase.maxDownloads

                  let status = "Active"
                  let statusColor = "bg-green-600"

                  if (isRevoked) {
                    status = "Revoked"
                    statusColor = "bg-red-600"
                  } else if (isExpired) {
                    status = "Expired"
                    statusColor = "bg-amber-600"
                  } else if (hasReachedLimit) {
                    status = "Limit Reached"
                    statusColor = "bg-amber-600"
                  }

                  return (
                    <TableRow key={purchase.id} className="border-blue-100">
                      <TableCell className="font-medium text-blue-700">{purchase.productName}</TableCell>
                      <TableCell>{purchase.userEmail}</TableCell>
                      <TableCell>{purchase.purchaseDate.toLocaleDateString()}</TableCell>
                      <TableCell>{formatPrice(purchase.amount)}</TableCell>
                      <TableCell>
                        {purchase.downloadCount || 0}
                        {purchase.maxDownloads ? ` / ${purchase.maxDownloads}` : ""}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className={statusColor}>
                          {status}
                        </Badge>
                      </TableCell>
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
                              <Link href={`/admin/purchases/${purchase.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetDownloadCount(purchase.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reset Downloads
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExtendExpiry(purchase.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Extend Expiry
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleRevokeAccess(purchase.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Revoke Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
