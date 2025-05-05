import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/firebase-config"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourseById(params.courseId)

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found",
    }
  }

  return {
    title: `${course.title} | Digital Marketplace`,
    description: course.description,
  }
}

async function getCourseById(courseId: string) {
  try {
    const courseRef = doc(db, "courses", courseId)
    const courseSnap = await getDoc(courseRef)

    if (!courseSnap.exists()) {
      return null
    }

    const data = courseSnap.data()
    return {
      id: courseSnap.id,
      title: data.title || "Untitled Course",
      description: data.description || "No description available",
      imageUrl: data.imageUrl || "/placeholder.svg?height=600&width=800",
      price: data.price || 0,
      features: data.features || [],
      content: data.content || [],
      slug: data.slug || courseSnap.id,
    }
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseById(params.courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
            <img
              src={course.imageUrl || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl font-semibold mb-6">₹{course.price.toFixed(2)}</p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{course.description}</p>
          </div>

          <Link href={`/courses/${params.courseId}/checkout`}>
            <Button size="lg" className="w-full">
              Buy Now
            </Button>
          </Link>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
            <ul className="space-y-2">
              {course.features && course.features.length > 0 ? (
                course.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))
              ) : (
                <li>Comprehensive course content</li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            {course.content && course.content.length > 0 ? (
              <div className="space-y-4">
                {course.content.map((section: any, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-4 font-medium">{section.title}</div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {section.lessons.map((lesson: any, lessonIndex: number) => (
                          <li key={lessonIndex} className="flex items-center">
                            <span className="mr-2">📄</span>
                            <span>{lesson.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Course content details will be available after purchase.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
