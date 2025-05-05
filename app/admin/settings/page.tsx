"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Save, Key, User, Mail } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { checkAdminStatus, updateAdminCredentials } from "@/lib/admin-auth"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

export default function AdminSettingsPage() {
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adminInfo, setAdminInfo] = useState<any>(null)
  const [loginHistory, setLoginHistory] = useState<any[]>([])

  const [credentialsForm, setCredentialsForm] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
    newDisplayName: "",
  })

  // Get admin info
  useEffect(() => {
    const getAdminInfo = async () => {
      try {
        const { isAdmin, adminData } = await checkAdminStatus()

        if (isAdmin && adminData) {
          setAdminInfo(adminData)

          // Pre-fill display name
          setCredentialsForm((prev) => ({
            ...prev,
            newDisplayName: adminData.displayName || "",
          }))

          // Get login history
          const adminUid = localStorage.getItem("adminUid")
          if (adminUid) {
            const loginHistoryQuery = query(
              collection(db, "adminLoginHistory"),
              orderBy("timestamp", "desc"),
              limit(10),
            )

            const loginHistorySnapshot = await getDocs(loginHistoryQuery)
            const loginHistoryData = loginHistorySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))

            setLoginHistory(loginHistoryData)
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error getting admin info:", error)
        setIsLoading(false)
      }
    }

    getAdminInfo()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentialsForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form
      if (!credentialsForm.currentPassword) {
        throw new Error("Current password is required")
      }

      if (credentialsForm.newPassword && credentialsForm.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long")
      }

      if (credentialsForm.newPassword && credentialsForm.newPassword !== credentialsForm.confirmPassword) {
        throw new Error("New password and confirm password do not match")
      }

      // Update credentials
      await updateAdminCredentials(
        credentialsForm.currentPassword,
        credentialsForm.newEmail || undefined,
        credentialsForm.newPassword || undefined,
        credentialsForm.newDisplayName || undefined,
      )

      // Reset form
      setCredentialsForm({
        currentPassword: "",
        newEmail: "",
        newPassword: "",
        confirmPassword: "",
        newDisplayName: credentialsForm.newDisplayName,
      })

      toast({
        title: "Success",
        description: "Admin credentials updated successfully",
      })
    } catch (error: any) {
      console.error("Error updating admin credentials:", error)
      setError(error.message || "Failed to update credentials. Please try again.")

      toast({
        title: "Error",
        description: error.message || "Failed to update credentials",
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
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight blue-gradient-text">Admin Settings</h2>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="bg-blue-50 border-blue-100">
            <TabsTrigger value="account" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Security
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Login Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your admin account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminInfo && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{adminInfo.email}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Role</Label>
                        <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="capitalize">{adminInfo.role || "Admin"}</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateCredentials} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="newDisplayName">Display Name</Label>
                        <Input
                          id="newDisplayName"
                          name="newDisplayName"
                          value={credentialsForm.newDisplayName}
                          onChange={handleInputChange}
                          className="border-blue-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={credentialsForm.currentPassword}
                          onChange={handleInputChange}
                          className="border-blue-200"
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your email and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">New Email Address</Label>
                    <Input
                      id="newEmail"
                      name="newEmail"
                      type="email"
                      value={credentialsForm.newEmail}
                      onChange={handleInputChange}
                      className="border-blue-200"
                      placeholder="Leave blank to keep current email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={credentialsForm.newPassword}
                      onChange={handleInputChange}
                      className="border-blue-200"
                      placeholder="Leave blank to keep current password"
                    />
                    <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={credentialsForm.confirmPassword}
                      onChange={handleInputChange}
                      className="border-blue-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityCurrentPassword">Current Password</Label>
                    <Input
                      id="securityCurrentPassword"
                      name="currentPassword"
                      type="password"
                      value={credentialsForm.currentPassword}
                      onChange={handleInputChange}
                      className="border-blue-200"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Update Security Settings
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
                <CardDescription>View your recent login history</CardDescription>
              </CardHeader>
              <CardContent>
                {loginHistory.length > 0 ? (
                  <div className="space-y-4">
                    {loginHistory.map((login) => (
                      <div key={login.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{login.ip || "Unknown IP"}</p>
                          <p className="text-sm text-gray-500">
                            {login.timestamp ? new Date(login.timestamp.toDate()).toLocaleString() : "Unknown time"}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${login.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {login.success ? "Successful" : "Failed"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No login history available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
