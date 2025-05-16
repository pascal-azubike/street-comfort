import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { QueryProvider } from "../components/query-provider"
import { ProtectedContent } from "@/components/auth/protected-content"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Check if user is admin
  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  return (
    <QueryProvider>
      <div className="flex flex-col min-h-screen">
        <ProtectedContent requireAdmin={true}>
          <main className="flex-1">
            {children}
          </main>
        </ProtectedContent>
      </div>
    </QueryProvider>
  )
} 