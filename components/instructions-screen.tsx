"use client"

import type React from "react"
import { useState } from "react"

interface InstructionsScreenProps {
  existingSources: string[]
  onContinue: (additionalSources: string[]) => void
}

export default function InstructionsScreen({ existingSources, onContinue }: InstructionsScreenProps) {
  const [additionalSources, setAdditionalSources] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Parse comma-separated sources, trim whitespace, and filter out empty strings
    const sources = additionalSources
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0)
    onContinue(sources)
  }

  return (
    <div className="card max-w-2xl w-full">
      <div className="card-header">
        <h2 className="card-title text-center">Instructions</h2>
      </div>
      <div className="card-content">
        <p className="text-base leading-relaxed mb-6">
          In this task, you will be shown several news sources. Your job is to rate their trustworthiness (vertical axis) and political leaning (horizontal axis). You can drag each news source and place them where you think it belongs on the chart.
        </p>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">News Sources:</h3>
          <ul className="list-disc list-inside space-y-1">
            {existingSources.map((source, index) => (
              <li key={index} className="text-base">{source}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="additionalSources" className="form-label">
              Add additional news sources (comma-separated)
            </label>
            <input
              id="additionalSources"
              type="text"
              className="form-input"
              value={additionalSources}
              onChange={(e) => setAdditionalSources(e.target.value)}
              placeholder="e.g., ABC News, CBS News, NBC News"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter any additional news sources you'd like to rate, separated by commas.
            </p>
          </div>
        </form>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary w-full" onClick={handleSubmit}>
          Continue
        </button>
      </div>
    </div>
  )
}

