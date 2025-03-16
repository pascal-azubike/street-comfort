'use client';

import Footer from "@/app/(home)/sections/Footer";
import { PageHero } from "@/app/(pages)/pageHero";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or already been used.",
    Default: "An error occurred during authentication."
  };

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div>
      <PageHero 
        title="Sign In Failed" 
        description="We couldn't complete your sign in request." 
      />
      
      <section className="py-8 md:py-20 relative flex-grow">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-[#FDF7F5] rounded-xl p-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#F3E6DC] flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-[#593C2D]" />
              </div>
              
              <div className="text-center space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-['Playfair_Display'] text-[#593C2D]">
                  Sign In Failed
                </h2>
                <p className="text-[#593C2D]/60 leading-relaxed text-sm md:text-base break-words">
                  {message}
                </p>
              </div>

              <div className="pt-4 text-center">
                <Link href="/auth/signin">
                  <Button className="bg-[#593C2D] hover:bg-[#593C2D]/90 text-white">
                    Try Again
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
      </section>
      <Footer />
    </div>
  );
} 