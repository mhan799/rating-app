"use client"
import { useState } from "react"

interface CompletionScreenProps {
  userId: string
  ratings: Record<string, { value: number; bias: number }>
  onDownload: () => void
}

export default function CompletionScreen({ userId, ratings, onDownload }: CompletionScreenProps) {
  const date = new Date().toISOString().split("T")[0]
  const filename = `${userId}_${date}.json`

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

        <div
          style={{ border: "1px solid #ddd", borderRadius: "0.375rem", padding: "1rem", backgroundColor: "#f9fafb" }}
        >
          <h3 style={{ fontWeight: 500, marginBottom: "0.5rem" }}>Summary of your ratings:</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {Object.entries(ratings).map(([source, { value, bias }]) => (
              <li key={source} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <span>{source}:</span>
                <span>
                  Value: {value.toFixed(2)}, Bias: {bias.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
