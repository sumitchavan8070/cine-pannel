"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileCode, ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"

export default function SwaggerYamlPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/docs/swagger")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("# Failed to load swagger.yaml"))
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading swagger.yaml...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Swagger / OpenAPI Spec (YAML)
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Raw OpenAPI 3.0 specification for CineMarathi API
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy YAML"}
          </Button>
          <Link href="/admin/settings">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={18} />
              Back to Settings
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-white border-0 shadow-xl">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="text-white" size={20} />
            <span className="font-semibold text-white">swagger.yaml</span>
          </div>
        </div>
        <pre className="p-6 overflow-x-auto text-sm text-slate-700 bg-slate-50 max-h-[calc(100vh-280px)] overflow-y-auto">
          <code>{content}</code>
        </pre>
      </Card>
    </div>
  )
}
