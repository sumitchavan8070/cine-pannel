"use client"

import { Card } from "@/components/ui/card"
import { FileCode, ExternalLink } from "lucide-react"
import Link from "next/link"

function getApiDocsUrl() {
  const serverUrl = process.env.SERVER_URL || ""
  return serverUrl.replace(/\/api\/?$/, "").replace(/\/$/, "") + "/api-docs"
}

export default function ApiDocsPage() {
  const apiDocsUrl = getApiDocsUrl()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Interactive Swagger/OpenAPI documentation for CineMarathi API
          </p>
        </div>
        <Link
          href={apiDocsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ExternalLink size={18} />
          Open in New Tab
        </Link>
      </div>

      <Card className="p-0 overflow-hidden bg-white border-0 shadow-xl">
        <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-slate-900 to-slate-800">
          <FileCode className="text-white" size={20} />
          <span className="font-semibold text-white">Swagger UI</span>
        </div>
        <div className="h-[calc(100vh-220px)] min-h-[500px]">
          <iframe
            src={apiDocsUrl}
            title="CineMarathi API Documentation"
            className="w-full h-full border-0"
          />
        </div>
      </Card>
    </div>
  )
}
