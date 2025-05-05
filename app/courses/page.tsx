import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/firebase-config"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Courses | Digital Marketplace",
  description: "Browse our collection of digital courses",
}

interface Course {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
  slug: string
}

async function getCourses(): Promise<Course[]> {
  try {
    const coursesRef = collection(db, "courses")
    const coursesSnapshot = await getDocs(coursesRef)

    return coursesSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || "Untitled Course",
        description: data.description || "No description available",
        imageUrl: data.imageUrl || "/placeholder.svg?height=300&width=400",
        price: data.price || 0,
        slug: data.slug || doc.id,
      }
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Digital Courses</h1>

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-4">No courses available</h2>
          <p className="text-gray-600">Check back soon for new courses!</p>
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
              <CardFooter>
                <Link href={`/courses/${course.slug}`} className="w-full">
                  <Button className="w-full">View Course</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
