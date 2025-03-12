import Footer from "../(home)/sections/Footer"
import { QueryProvider } from "../(protected)/components/query-provider"

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
            </div>
        </QueryProvider>
    )
}
