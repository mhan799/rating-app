"use client"
import { useRef, useEffect } from "react"

interface CompletionScreenProps {
  userId: string
  ratings: Record<string, { value: number; bias: number }>
  message: string
  status: "success" | "error" | ""
}

export default function CompletionScreen({ userId, ratings, message, status }: CompletionScreenProps) {
  const hasUploadedRef = useRef(false)
  useEffect(() => {

    const uploadData = async () => {
      if (hasUploadedRef.current) return
      hasUploadedRef.current = true

      try {
        const response = await fetch("/api/upload-news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            uid: userId,
            data: ratings
          })
        })

        if (response.ok) {
          const res = await response.json()
          console.log("✅ Upload successful", res)
        } else {
          const err = await response.json()
          console.error("❌ Upload failed:", err)
        }
      } catch (err) {
        console.error("❌ Network error while uploading to server.", err)
      }
    }

    uploadData()
  }, [userId, ratings])

  return (
    <div className="card max-w-md w-full">
      <div className="card-header">
        <h2 className="card-title text-center">Thank You!</h2>
        <p className="card-description text-center">You have successfully completed rating all news sources.</p>
      </div>

        {message && (
        <div
          className={`mt-4 text-center font-medium ${status === "success" ? "text-green-600" : "text-red-600"}`}
        >
          {status === "success" ? `${message}` : `${message}`}
        </div>
      )}

      <div className="card-footer gap-4 justify-center">
        <button onClick={() => window.location.reload()} className="btn btn-secondary">
          Start Over
        </button>
      </div>
    </div>
  )
}
