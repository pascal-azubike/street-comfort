import { auth } from "@/auth"
import { redirect } from "next/navigation"

type ProtectedLayoutProps = {
  children: React.ReactNode
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex flex-col min-h-screen">


      {/* Main Content with Sidebar */}
      <div className="">

        {/* Page Content */}

        {children}

      </div>
    </div>
  )
} 