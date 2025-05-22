import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId, filename, ratings } = await req.json()

    if (!userId || !filename || !ratings) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 })
    }

    const resultsDir = path.join(process.cwd(), 'results')
    const filePath = path.join(resultsDir, filename)

    // Ensure the results directory exists
    await fs.mkdir(resultsDir, { recursive: true })

    // Write file
    await fs.writeFile(filePath, JSON.stringify(ratings, null, 2), 'utf-8')

    return NextResponse.json({ message: 'Result saved successfully' })
  } catch (err) {
    console.error('Save error:', err)
    return NextResponse.json({ message: 'Server error while saving file' }, { status: 500 })
  }
}
