"use client"

import type React from "react"

interface InstructionsScreenProps {
  onContinue: () => void
}

export default function InstructionsScreen({ onContinue }: InstructionsScreenProps) {
  return (
    <div className="card max-w-2xl w-full">
      <div className="card-header">
        <h2 className="card-title text-center">Instructions</h2>
      </div>
      <div className="card-content">
        <p className="text-base leading-relaxed mb-6">
          In this task, you will be shown several news sources. Your job is to rate their trustworthiness (vertical axis) and political leaning (horizontal axis). You can drag each news source and place them where you think it belongs on the chart.
        </p>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary w-full" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

