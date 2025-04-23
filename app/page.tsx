"use client"

import { useEffect, useState } from "react"
import LoginScreen from "@/components/login-screen"
// import RatingScreen from "@/components/rating-screen"
import DragRatingScreen from "@/components/rating-screen"

import CompletionScreen from "@/components/completion-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "rating" | "completion">("login")
  const [userId, setUserId] = useState("")
  const [ratings, setRatings] = useState<Record<string, { value: number; bias: number }>>({})

  const [newsSources, setNewsSources] = useState<string[]>([])
  
  // Load news sources from file
  useEffect(() => {
    fetch("/news_sources.txt")
      .then((res) => res.text())
      .then((text) => setNewsSources(text.split("\n").filter(Boolean)))
  }, [])

  // List of news sources to rate
  // const newsSources = [
  //   "CNN",
  //   "Fox News",
  //   "MSNBC",
  //   "BBC",
  //   "The New York Times",
  //   "The Wall Street Journal",
  //   "NPR",
  //   "Breitbart",
  //   "The Guardian",
  //   "Reuters",
  // ]

  // const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  // const currentSource = newsSources[currentSourceIndex]

  const handleLogin = (id: string) => {
    setUserId(id)
    setCurrentScreen("rating")
  }

  const handleRatingComplete = (newRatings: Record<string, { value: number; bias: number }>) => {
    setRatings(newRatings)

    const date = new Date().toISOString().split("T")[0]
    const filename = `${userId}_${date}.json`

    setRatings(newRatings)
    setCurrentScreen("completion")

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
          ratings={ratings}
          onDownload={() => {
            const date = new Date().toISOString().split("T")[0]
            const filename = `${userId}_${date}.json`

            const jsonData = JSON.stringify(ratings, null, 2)
            const blob = new Blob([jsonData], { type: "application/json" })
            const url = URL.createObjectURL(blob)

            const a = document.createElement("a")
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()

            URL.revokeObjectURL(url)
            document.body.removeChild(a)
          }}
        />
      )}
    </main>
  )
}

//   const handleRating = (source: string, value: number, bias: number) => {
//     setRatings((prev) => ({
//       ...prev,
//       [source]: { value, bias },
//     }))

//     if (currentSourceIndex < newsSources.length - 1) {
//       setCurrentSourceIndex(currentSourceIndex + 1)
//     } else {
//       // Save the data
//       const date = new Date().toISOString().split("T")[0]
//       const filename = `${userId}_${date}.json`

//       // Create a downloadable file
//       const jsonData = JSON.stringify(ratings, null, 2)
//       const blob = new Blob([jsonData], { type: "application/json" })
//       const url = URL.createObjectURL(blob)

//       // Create a link and trigger download
//       const a = document.createElement("a")
//       a.href = url
//       a.download = filename
//       document.body.appendChild(a)
//       a.click()

//       // Clean up
//       URL.revokeObjectURL(url)
//       document.body.removeChild(a)

//       // Move to completion screen
//       setCurrentScreen("completion")
//     }
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
//       {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}

//       {currentScreen === "rating" && (
//         <RatingScreen
//           source={currentSource}
//           sourceIndex={currentSourceIndex}
//           totalSources={newsSources.length}
//           onRate={handleRating}
//         />
//       )}

//       {currentScreen === "completion" && (
//         <CompletionScreen
//           userId={userId}
//           ratings={ratings}
//           onDownload={() => {
//             // Allow re-downloading the file
//             const date = new Date().toISOString().split("T")[0]
//             const filename = `${userId}_${date}.json`

//             const jsonData = JSON.stringify(ratings, null, 2)
//             const blob = new Blob([jsonData], { type: "application/json" })
//             const url = URL.createObjectURL(blob)

//             const a = document.createElement("a")
//             a.href = url
//             a.download = filename
//             document.body.appendChild(a)
//             a.click()

//             URL.revokeObjectURL(url)
//             document.body.removeChild(a)
//           }}
//         />
//       )}
//     </main>
//   )
// }
