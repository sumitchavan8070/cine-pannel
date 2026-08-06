"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DOC_OPTIONS = [
  { value: "admin-panel", label: "Admin Panel Guide" },
  { value: "api", label: "API Documentation" },
  { value: "deploy", label: "Deployment Guide" },
  { value: "readme", label: "README" },
]

export default function AdminPanelDocsPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [doc, setDoc] = useState("admin-panel")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/docs/admin-panel?doc=${doc}`)
      .then((res) => res.json())
      .then((data) => setContent(data.content || data.error || ""))
      .catch(() => setContent("# Failed to load documentation"))
      .finally(() => setLoading(false))
  }, [doc])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading documentation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Project documentation and guides
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={doc} onValueChange={setDoc}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select doc" />
            </SelectTrigger>
            <SelectContent>
              {DOC_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link href="/admin/settings">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={18} />
              Back to Settings
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 sm:p-8 bg-white border-0 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-slate-600" size={24} />
          <span className="font-semibold text-slate-900">Documentation</span>
        </div>
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-slate-600 prose-li:text-slate-600 prose-table:border prose-pre:bg-slate-100 prose-pre:text-sm">
          <MarkdownContent content={content} />
        </div>
      </Card>
    </div>
  )
}

function MarkdownContent({ content }) {
  const lines = content.split("\n")
  const elements = []
  let inTable = false
  let tableRows = []
  let inCodeBlock = false
  let codeBlockContent = []
  let codeBlockLang = ""
  let keyCounter = 0
  const nextKey = () => `md-${keyCounter++}`

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <table key={nextKey()} className="w-full border-collapse border border-slate-200 my-4">
          <tbody>{tableRows}</tbody>
        </table>
      )
      tableRows = []
    }
    inTable = false
  }

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      elements.push(
        <pre key={nextKey()} className="bg-slate-100 p-4 rounded-lg overflow-x-auto text-sm my-4">
          <code>{codeBlockContent.join("\n")}</code>
        </pre>
      )
      codeBlockContent = []
    }
    inCodeBlock = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock()
      } else {
        inCodeBlock = true
        codeBlockLang = line.slice(3)
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      if (!inTable) {
        flushTable()
        inTable = true
      }
      // Skip separator row (|---|---|)
      if (/^\|[\s\-:|]+\|$/.test(line)) continue
      const cells = line.split("|").slice(1, -1).map((c) => c.trim())
      const isHeader = tableRows.length === 0
      tableRows.push(
        <tr key={nextKey()} className={isHeader ? "bg-slate-100 font-semibold" : ""}>
          {cells.map((cell, j) => (
            <td key={j} className="border border-slate-200 px-4 py-2">
              {cell}
            </td>
          ))}
        </tr>
      )
      continue
    }

    if (inTable) flushTable()

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={nextKey()} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={nextKey()} className="text-xl font-bold text-slate-900 mt-8 mb-4">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={nextKey()} className="text-lg font-bold text-slate-900 mt-6 mb-3">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={nextKey()} className="ml-4 text-slate-600 list-disc">
          {line.slice(2)}
        </li>
      )
    } else if (line.trim() === "---") {
      elements.push(<hr key={nextKey()} className="my-6 border-slate-200" />)
    } else if (line.trim()) {
      elements.push(
        <p key={nextKey()} className="text-slate-600 my-2">
          {line}
        </p>
      )
    }
  }

  flushTable()
  flushCodeBlock()

  return <div className="space-y-1">{elements}</div>
}
