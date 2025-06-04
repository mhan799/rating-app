"use client"

import { useEffect, useState } from "react"
import LoginScreen from "@/components/login-screen"
import DragRatingScreen from "@/components/rating-screen"
import CompletionScreen from "@/components/completion-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "rating" | "completion">("login")
  const [userId, setUserId] = useState("")
  const [ratings, setRatings] = useState<Record<string, { value: number; bias: number }>>({})
  const [newsSources, setNewsSources] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"success" | "error" | "">("")
  
  // Load news sources from file
  useEffect(() => {
    fetch("/news_sources.txt")
      .then((res) => res.text())
      .then((text) => setNewsSources(text.split("\n").filter(Boolean)))
  }, [])


  const handleLogin = (id: string) => {
    setUserId(id)
    setCurrentScreen("rating")
  }

  const handleRatingComplete = (newRatings: Record<string, { value: number; bias: number }>) => {
    setRatings(newRatings)
    setCurrentScreen("completion")

  }

  const handleDownloadAndSave = async () => {
    const filename = `${userId}.json`

    // Browser download
    // const jsonData = JSON.stringify(ratings, null, 2)
    // const blob = new Blob([jsonData], { type: "application/json" })
    // const url = URL.createObjectURL(blob)
    // const a = document.createElement("a")
    // a.href = url
    // a.download = filename
    // document.body.appendChild(a)
    // a.click()
    // URL.revokeObjectURL(url)
    // document.body.removeChild(a)

    try {
      const response = await fetch("/api/saveResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, filename, ratings })
      })

      if (response.ok) {
        setMessage("✅ Successfully downloaded results!")
        setStatus("success")
      } else {
        const data = await response.json()
        setMessage("❌ Server error: " + (data?.message || "Unable to save."))
        setStatus("error")
      }
    } catch (err) {
      setMessage("❌ Network error while saving to server.")
      setStatus("error")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}

      {currentScreen === "rating" && newsSources.length > 0 && (
        <DragRatingScreen
          newsSources={newsSources}
          onComplete={handleRatingComplete}
        />
      )}

      {currentScreen === "completion" && (
        <CompletionScreen
          userId={userId}
          message={message}
          status={status}
          onDownload={handleDownloadAndSave}
        />
      )}
    </main>
  )
}
