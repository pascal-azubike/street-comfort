import Footer from "@/components/Footer"
import { QueryProvider } from "../(protected)/components/query-provider"
import { MessageCircle } from 'lucide-react'


type LayoutProps = {
    children: React.ReactNode
}

export default async function PagesLayout({
    children,
}: LayoutProps) {
    return (
        <QueryProvider>
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow">
                    {children}
                    <Footer />
                </main>
                
                {/* WhatsApp Floating Button */}
                <a
                    href="https://wa.me/2347035226775" // Updated WhatsApp number
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 flex items-center justify-center"
                    aria-label="Chat on WhatsApp"
                >
                    <MessageCircle size={24} />
                </a>
            </div>
        </QueryProvider>
    )
}
