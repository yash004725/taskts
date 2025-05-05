import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase-config"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { getServerUser } from "@/lib/server-auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "My Courses | Digital Marketplace",
  description: "Access your purchased courses",
}

interface Course {
  id: string
  title: string
  description: string
  imageUrl: string
  slug: string
  status: string
  purchaseDate: string
}

async function getPurchasedCourses(userId: string): Promise<Course[]> {
  try {
    // Get all orders for the user
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId))
    const ordersSnapshot = await getDocs(ordersQuery)

    if (ordersSnapshot.empty) {
      return []
    }

    // Get course IDs from orders
    const courseIds = ordersSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        courseId: data.courseId,
        status: data.status,
        purchaseDate: data.createdAt?.toDate?.() || new Date(),
        orderId: doc.id,
      }
    })

    // Get course details for each course ID
    const courses: Course[] = []

    for (const item of courseIds) {
      const courseRef = doc(db, "courses", item.courseId)
      const courseSnap = await getDoc(courseRef)

      if (courseSnap.exists()) {
        const courseData = courseSnap.data()
        courses.push({
          id: courseSnap.id,
          title: courseData.title,
          description: courseData.description,
          imageUrl: courseData.imageUrl || "/placeholder.svg?height=300&width=400",
          slug: courseData.slug || courseSnap.id,
          status: item.status,
          purchaseDate:
            item.purchaseDate instanceof Date
              ? item.purchaseDate.toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
        })
      }
    }

    return courses
  } catch (error) {
    console.error("Error fetching purchased courses:", error)
    return []
  }
}

export default async function DashboardCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getServerUser()

  if (!user) {
    redirect("/login?redirect=/dashboard/courses")
  }

  const courses = await getPurchasedCourses(user.uid)
  const status = searchParams.status
  const orderId = searchParams.orderId

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      {status === "pending" && orderId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-yellow-800">Payment Being Verified</h2>
          <p className="text-yellow-700">
            Your payment for order #{orderId} is being verified. Once confirmed, you'll get access to the course. This
            usually takes less than 24 hours.
          </p>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-4">You haven't purchased any courses yet</h2>
          <p className="text-gray-600 mb-6">Browse our collection and start learning today!</p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col h-full">
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={course.imageUrl || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="mr-2">{course.title}</CardTitle>
                  <Badge variant={course.status === "verified" ? "default" : "outline"}>
                    {course.status === "verified" ? "Active" : "Pending"}
                  </Badge>
                </div>
                <CardDescription>Purchased on {course.purchaseDate}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3">{course.description}</p>
              </CardContent>
              <CardFooter>
                {course.status === "verified" ? (
                  <Link href={`/dashboard/courses/${course.slug}`} className="w-full">
                    <Button className="w-full">Access Course</Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Pending Verification
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
