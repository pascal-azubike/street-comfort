export default function LoadingView({ message }: { message?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="space-y-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto" />
                <p className="text-zinc-500">{message || " Loading product details..."}</p>
            </div>
        </div>
    );
} 