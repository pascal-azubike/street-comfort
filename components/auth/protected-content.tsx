"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedContentProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedContent({ children, requireAdmin = false }: ProtectedContentProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#593C2D]" />
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  if (requireAdmin && session.user?.role !== "admin") {
    redirect("/") // or to a "not authorized" page
  }

  return <>{children}</>
} 