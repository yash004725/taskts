import { Skeleton } from "@/components/ui/skeleton"
import AdminLayout from "@/components/admin-layout"

export default function AdminPurchasesLoading() {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-10 w-64 mb-4" />

        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="rounded-md border border-blue-100">
          <div className="bg-blue-50 p-3">
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
          </div>

          <div className="p-2 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4 p-2">
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-6" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
