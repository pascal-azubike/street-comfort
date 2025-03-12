import Link from 'next/link';

export default function NotFoundView() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4 p-6 max-w-md">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-2xl font-bold text-zinc-900">Product Not Found</h1>
                <p className="text-zinc-500">The product you're looking for doesn't exist or has been removed.</p>
                <Link 
                    href="/products"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        </div>
    );
} 