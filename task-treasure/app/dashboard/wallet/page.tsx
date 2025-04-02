import { getUserProfile, getWalletBalance } from "@/lib/user-auth"
import { Wallet, ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function WalletPage() {
  const user = await getUserProfile()
  const balance = await getWalletBalance()

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">₹{balance || 0}</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              Withdraw Funds
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-white to-green-50">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ArrowDown className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Task Completion Reward</p>
                  <p className="text-xs text-muted-foreground">Apr 15, 2023</p>
                </div>
              </div>
              <p className="font-bold text-green-600">+₹150</p>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-white to-green-50">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ArrowDown className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Task Completion Reward</p>
                  <p className="text-xs text-muted-foreground">Apr 12, 2023</p>
                </div>
              </div>
              <p className="font-bold text-green-600">+₹75</p>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-white to-red-50">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <ArrowUp className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Withdrawal to Bank Account</p>
                  <p className="text-xs text-muted-foreground">Apr 10, 2023</p>
                </div>
              </div>
              <p className="font-bold text-red-600">-₹200</p>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-white to-green-50">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ArrowDown className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Task Completion Reward</p>
                  <p className="text-xs text-muted-foreground">Apr 5, 2023</p>
                </div>
              </div>
              <p className="font-bold text-green-600">+₹100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

