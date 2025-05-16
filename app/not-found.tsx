import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1A1A] text-[#E6DDD6]">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-9xl font-bold mb-8 text-[#593C2D]">404</h1>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-['Playfair_Display']">
              Page Not Found
            </h2>
            
            <p className="text-[#E6DDD6]/60">
              Oops! The page you're looking for seems to have vanished into the ether.
            </p>

            <Link href="/">
              <Button 
                className="bg-[#593C2D] hover:bg-[#593C2D]/80 text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 