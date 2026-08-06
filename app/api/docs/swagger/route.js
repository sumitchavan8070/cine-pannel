import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "swagger.yaml")
    const content = fs.readFileSync(filePath, "utf8")
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/yaml",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load swagger.yaml" },
      { status: 500 }
    )
  }
}
