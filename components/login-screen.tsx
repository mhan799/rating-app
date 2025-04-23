"use client"

import type React from "react"

import { useState } from "react"

interface LoginScreenProps {
  onLogin: (userId: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId.trim()) {
      setError("User ID is required")
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      return
    }

    // In a real app, you would validate credentials here
    // For this demo, we'll just proceed with any non-empty values
    onLogin(userId)
  }

  return (
    <div className="card max-w-md w-full">
      <div className="card-header">
        <h2 className="card-title text-center">News Source Rating Study</h2>
        <p className="card-description text-center">Please log in to begin rating news sources</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="userId" className="form-label">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              className="form-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-error">{error}</p>}
        </form>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary w-full" onClick={handleSubmit}>
          Log In
        </button>
      </div>
    </div>
  )
}
