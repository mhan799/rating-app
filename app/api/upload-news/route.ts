// app/api/upload-news/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("📦 Upload payload:", body)

    const response = await fetch("https://connect.europa.khoury.northeastern.edu/internal_web/upload-news/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    console.log("✅ Proxy response:", data)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ message: "Proxy error", error: error.message }, { status: 500 })
  }
}
