import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DOC_FILES = {
  "admin-panel": "docs/ADMIN_PANEL.md",
  api: "docs/API.md",
  deploy: "docs/deploy.md",
  readme: "README.md",
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const doc = searchParams.get("doc") || "admin-panel"
  const filePath = DOC_FILES[doc] || DOC_FILES["admin-panel"]

  try {
    const fullPath = path.join(process.cwd(), filePath)
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "Documentation not found", content: `# ${doc} not found` },
        { status: 404 }
      )
    }
    const content = fs.readFileSync(fullPath, "utf8")
    return NextResponse.json({ content, doc })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load documentation", content: "# Documentation not found" },
      { status: 500 }
    )
  }
}
