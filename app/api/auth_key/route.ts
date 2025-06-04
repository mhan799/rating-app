import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.resolve(process.cwd(), "auth_key.txt")
    const authKey = fs.readFileSync(filePath, "utf-8").trim()

    return NextResponse.json({ auth_key: authKey })
  } catch (error) {
    return NextResponse.json({ error: "Failed to read auth key" }, { status: 500 })
  }
}
