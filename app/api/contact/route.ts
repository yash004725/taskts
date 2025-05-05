import { NextResponse } from "next/server"
import { collection, addDoc } from "firebase/firestore"
import { getFirestore } from "firebase/firestore"
import { initializeApp, getApps } from "firebase/app"

// Initialize Firebase if it hasn't been initialized yet
let db: any
try {
  if (!getApps().length) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } else {
    db = getFirestore()
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Add timestamp
    const contactData = {
      ...body,
      createdAt: new Date().toISOString(),
      status: "new",
    }

    // Save to Firestore
    const docRef = await addDoc(collection(db, "contacts"), contactData)

    // Send email notification (in a real app, you would use a service like SendGrid or Nodemailer)
    // This is a placeholder for the email sending logic
    console.log("Contact form submission:", contactData)

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      id: docRef.id,
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
