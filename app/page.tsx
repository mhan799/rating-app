"use client"

import { useEffect, useState } from "react"
import LoginScreen from "@/components/login-screen"
import InstructionsScreen from "@/components/instructions-screen"
import DragRatingScreen from "@/components/rating-screen"
import CompletionScreen from "@/components/completion-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "instructions" | "rating" | "completion">("login")
  const [userId, setUserId] = useState("")
  const [ratings, setRatings] = useState<Record<string, { value: number; bias: number }>>({})
  const [newsSources, setNewsSources] = useState<string[]>([
    "CNN",
    "Fox News",
    "MSNBC",
    "BBC",
    "The New York Times",
    "The Wall Street Journal",
    "NPR",
    "Breitbart",
    "The Guardian",
    "Reuters"
  ])
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"success" | "error" | "">("")

  
  // Load news sources from file
  // useEffect(() => {
  //   fetch("/news_sources.txt")
  //     .then((res) => res.text())
  //     .then((text) => setNewsSources(text.split("\n").filter(Boolean)))
  // }, [])


  const handleLogin = (id: string) => {
    setUserId(id)
    setCurrentScreen("instructions")
  }

  const handleInstructionsContinue = (additionalSources: string[]) => {
    // Merge additional sources with existing sources, avoiding duplicates
    const allSources = [...newsSources]
    additionalSources.forEach(source => {
      if (!allSources.includes(source)) {
        allSources.push(source)
      }
    })
    setNewsSources(allSources)
    setCurrentScreen("rating")
  }

  const handleRatingComplete = (newRatings: Record<string, { value: number; bias: number }>) => {
    setRatings(newRatings)
    setCurrentScreen("completion")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}

      {currentScreen === "instructions" && (
        <InstructionsScreen 
          topSources={newsSources.slice(0, 3)}
          onContinue={handleInstructionsContinue} 
        />
      )}

      {currentScreen === "rating" && newsSources.length > 0 && (
        <DragRatingScreen
          newsSources={newsSources}
          onComplete={handleRatingComplete}
        />
      )}

      {currentScreen === "completion" && (
        <CompletionScreen
          userId={userId}
          ratings={ratings}
          message={message}
          status={status}
          setMessage={setMessage}
          setStatus={setStatus}
        />
      )}
    </main>
  )
}
