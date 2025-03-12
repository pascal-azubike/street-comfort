interface ErrorViewProps {
    error: Error | null;
}

export default function ErrorView({ error }: ErrorViewProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4 p-6 max-w-md">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-zinc-900">Something went wrong</h1>
                <p className="text-zinc-500">{error?.message || 'An error occurred while loading the product.'}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
} 