"use client"
import { useState } from "react"

interface CompletionScreenProps {
  userId: string
  onDownload: () => void
  message: string
  status: "success" | "error" | ""
}

export default function CompletionScreen({ userId, message, status, onDownload }: CompletionScreenProps) {
  const date = new Date().toISOString().split("T")[0]
  const filename = `${userId}.json`

  return (
    <div className="card max-w-md w-full">
      <div className="card-header">
        <h2 className="card-title text-center">Thank You!</h2>
        <p className="card-description text-center">You have successfully completed rating all news sources.</p>
      </div>
      <div className="card-content space-y-4">
        <p className="text-center">
          File name: <strong>{filename}</strong>
        </p>
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
        <button onClick={onDownload} className="btn btn-primary">
          Download Results
        </button>
      </div>
    </div>
  )
}
