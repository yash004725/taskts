import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/firebase-config"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminAuthCheck } from "@/components/admin-auth-check"

export const metadata: Metadata = {
  title: "Manage Courses | Admin Dashboard",
  description: "Manage your courses",
}

interface Course {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  slug: string
}

async function getCourses(): Promise<Course[]> {
  const coursesCollection = collection(db, "courses")
  const coursesSnapshot = await getDocs(coursesCollection)

  return coursesSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl || "/placeholder.svg?height=300&width=400",
      slug: data.slug || doc.id,
    }
  })
}

export default async function AdminCoursesPage() {
  const courses = await getCourses()

  return (
    <AdminAuthCheck>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <Link href="/admin/courses/new">
            <Button>Add New Course</Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl">No courses available. Create your first course!</p>
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
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>₹{course.price.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-3">{course.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Link href={`/admin/courses/${course.id}`}>
                    <Button>Edit</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminAuthCheck>
  )
}
