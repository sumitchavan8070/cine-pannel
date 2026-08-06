"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, UserPlus } from "lucide-react"
import { apiPost } from "@/lib/api"
import { toast } from "sonner"

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "actor",
    contact: "",
    gender: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.password?.trim()) {
      toast.error("Name, email and password are required")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    try {
      setLoading(true)
      await apiPost("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        user_type: formData.user_type,
        contact: formData.contact?.trim() || null,
        gender: formData.gender || null,
      })
      toast.success("User created successfully")
      setFormData({ name: "", email: "", password: "", user_type: "actor", contact: "", gender: "" })
    } catch (error) {
      toast.error(error?.message || "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Create User
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Add a new user to the platform</p>
        </div>
      </div>

      <Card className="p-4 sm:p-6 bg-white border-0 shadow-xl max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full name"
              className="h-11 border-2 border-slate-200 focus:border-purple-500 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              className="h-11 border-2 border-slate-200 focus:border-purple-500 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 6 characters"
              className="h-11 border-2 border-slate-200 focus:border-purple-500 rounded-xl"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label>User type *</Label>
            <Select
              value={formData.user_type}
              onValueChange={(v) => setFormData({ ...formData, user_type: v })}
            >
              <SelectTrigger className="h-11 border-2 border-slate-200 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actor">Actor</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="production_house">Production House</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Phone number"
              className="h-11 border-2 border-slate-200 focus:border-purple-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={formData.gender || "none"}
              onValueChange={(v) => setFormData({ ...formData, gender: v === "none" ? "" : v })}
            >
              <SelectTrigger className="h-11 border-2 border-slate-200 rounded-xl">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {loading ? "Creating..." : "Create User"}
            </Button>
            <Link href="/admin/users">
              <Button type="button" variant="outline" className="h-11 rounded-xl">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
