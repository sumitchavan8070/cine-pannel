"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Download, Trash2, Loader2, HardDrive } from "lucide-react"
import { getAdminToken } from "@/lib/admin-auth"
import { apiGet, apiDelete } from "@/lib/api"
import { toast } from "sonner"

export default function BackupsPage() {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const fetchBackups = async () => {
    try {
      setLoading(true)
      const token = getAdminToken()
      const data = await apiGet("/admin/backups", { token })
      setBackups(data.backups || [])
    } catch (error) {
      console.error("[Backups] Error fetching backups:", error)
      toast.error(error?.message || "Failed to load backups")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const handleDownload = async (backup) => {
    try {
      const token = getAdminToken()
      const data = await apiGet(`/admin/backups/download/${encodeURIComponent(backup.key)}`, { token })
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer")
        toast.success("Download started")
      }
    } catch (error) {
      console.error("[Backups] Error getting download URL:", error)
      toast.error(error?.message || "Failed to get download URL")
    }
  }

  const handleDelete = async (backup) => {
    if (!confirm(`Are you sure you want to delete "${backup.filename}"?`)) {
      return
    }

    try {
      setDeleting(backup.key)
      const token = getAdminToken()
      await apiDelete(`/admin/backups/${encodeURIComponent(backup.key)}`, { token })
      toast.success("Backup deleted successfully")
      await fetchBackups()
    } catch (error) {
      console.error("[Backups] Error deleting:", error)
      toast.error(error?.message || "Failed to delete backup")
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "—"
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    const d = new Date(dateStr)
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Database Backups
        </h1>
        <p className="text-slate-600 mt-1">
          View and manage database backup files stored in S3. Upload via cron using{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">POST /api/admin/backups</code> with{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">X-API-Key</code> or Bearer token.
        </p>
      </div>

      {/* Backups List */}
      {backups.length === 0 ? (
        <Card className="p-12 text-center">
          <HardDrive className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No backups yet</h3>
          <p className="text-slate-600 mb-4">
            Backups will appear here when uploaded via cron or API. Use the upload API to add backups.
          </p>
          <p className="text-sm text-slate-500 font-mono bg-slate-50 p-3 rounded-lg text-left max-w-md mx-auto">
            curl -X POST -H &quot;X-API-Key: YOUR_BACKUP_API_KEY&quot; -F &quot;file=@backup.sql.gz&quot; /api/admin/backups
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {backups.length} backup{backups.length !== 1 ? "s" : ""} (newest first)
          </p>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Filename</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Size</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Uploaded</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backups.map((backup) => (
                  <tr key={backup.key} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900 truncate max-w-[200px]" title={backup.filename}>
                          {backup.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatFileSize(backup.size)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(backup.lastModified)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(backup)}
                          className="gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(backup)}
                          disabled={deleting === backup.key}
                        >
                          {deleting === backup.key ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
