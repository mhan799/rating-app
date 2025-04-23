"use client"

import { useState, useRef, useEffect  } from "react"

interface DragRatingScreenProps {
  newsSources: string[]
  onComplete: (ratings: Record<string, { value: number; bias: number }>) => void
}

interface PositionedSource {
  x: number
  y: number
  source: string
  color: string
}

const generateColor = (index: number) => {
  const colors = [
    "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9",
    "#BBDEFB", "#B2EBF2", "#B2DFDB", "#C8E6C9", "#DCEDC8"
  ]
  return colors[index % colors.length]
}

export default function DragRatingScreen({ newsSources, onComplete }: DragRatingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 })
  const [positionedSources, setPositionedSources] = useState<PositionedSource[]>([])
  const [draggingSource, setDraggingSource] = useState<string | null>(null)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Handle canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      const size = Math.min(window.innerWidth - 40, 500)
      setCanvasSize({ width: size, height: size })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, width, height)

    // Axes
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()

    // Labels
    ctx.fillStyle = "#000"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Left", width * 0.25, height / 2 + 30)
    ctx.fillText("Right", width * 0.75, height / 2 + 30)
    ctx.fillText("Bias", width / 2, height - 10)
    ctx.save()
    ctx.translate(20, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("News Value and Reliability", 0, 0)
    ctx.restore()
    ctx.fillText("More", width / 2 - 30, height * 0.25)
    ctx.fillText("Less", width / 2 - 30, height * 0.75)

    // Draw sources
    positionedSources.forEach(({ x, y, source, color }) => {
      const padding = 20
      const textWidth = ctx.measureText(source).width
      const rectWidth = textWidth + padding
      const rectHeight = 30
      ctx.fillStyle = color
      ctx.fillRect(x - rectWidth / 2, y - rectHeight / 2, rectWidth, rectHeight)
      ctx.fillStyle = "#000"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(source, x, y)
    })
  }, [canvasSize, positionedSources])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    for (const item of positionedSources) {
      const textWidth = ctx.measureText(item.source).width
      const padding = 20
      const rectWidth = textWidth + padding
      const rectHeight = 30

       if (
        x >= item.x - rectWidth / 2 &&
        x <= item.x + rectWidth / 2 &&
        y >= item.y - rectHeight / 2 &&
        y <= item.y + rectHeight / 2
      ) {
        setDraggingSource(item.source)
        setOffset({ x: x - item.x, y: y - item.y })
        return
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingSource) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - offset.x
    const y = e.clientY - rect.top - offset.y

    setPositionedSources((prev) =>
      prev.map((item) =>
        item.source === draggingSource ? { ...item, x, y } : item
      )
    )
  }

  const handleMouseUp = () => {
    setDraggingSource(null)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, source: string) => {
    setDraggingSource(source)
    const rect = e.currentTarget.getBoundingClientRect()
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }


  const handleDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!draggingSource) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const index = newsSources.indexOf(draggingSource)
    const color = generateColor(index)

    setPositionedSources((prev) => [...prev, { x, y, source: draggingSource, color }])
    setDraggingSource(null)
  }

  const handleComplete = () => {
    
    // Removed to allow unfinished rating.
    // if (positionedSources.length !== newsSources.length) {
    //   alert("Please rate all sources before submitting.")
    //   return
    // }

    const ratings: Record<string, { value: number; bias: number }> = {}
    const { width, height } = canvasSize

    positionedSources.forEach(({ x, y, source }) => {
      const bias = (x - width / 2) / (width / 2)
      const value = (height / 2 - y) / (height / 2)
      ratings[source] = { value, bias }
    })

    onComplete(ratings)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold">Drag News Sources to the Chart</h2>

      <div className="flex flex-wrap gap-2 justify-center bg-white p-4 rounded shadow w-full">
        {newsSources.map((source, index) =>
          positionedSources.find((s) => s.source === source) ? null : (
            <div
              key={source}
              draggable 
              onDragStart={(e) => handleDragStart(e, source)}
              className="cursor-pointer px-3 py-1 border rounded"
              style={{ backgroundColor: generateColor(index) }}
            >
              {source}
            </div>
          )
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{ border: "1px solid #ddd", cursor: "crosshair" }}
      />

      <button
        onClick={handleComplete}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Finish Rating
      </button>
    </div>
  )
}

