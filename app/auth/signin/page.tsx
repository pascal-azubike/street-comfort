"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PageHero } from "@/app/(pages)/pageHero";
import Footer from "@/app/(home)/sections/Footer";


export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("nodemailer", {
      email,
      callbackUrl,
    });
    setIsLoading(false);
  };

  return (
    <div>
      <PageHero 
        title="Sign In" 
        description="Welcome back to Street Comfort" 
      />
      
      <section className="py-20 relative min-h-screen">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-['Playfair_Display'] text-[#593C2D]">
                  Choose your sign in method
                </h2>
                <p className="text-[#593C2D]/60 text-sm">
                  Access your account securely
                </p>
              </div>

              <Button 
                variant="outline"
                className="w-full border-[#593C2D]/20 text-[#593C2D] hover:bg-[#F3E6DC]/50"
                onClick={() => signIn("google", { callbackUrl })}
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#593C2D]/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#593C2D]/40">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#593C2D]/20 focus:ring-[#593C2D]/20"
                  autoComplete="email"
                  required
                />
                <Button 
                  className="w-full bg-[#593C2D] hover:bg-[#593C2D]/90 text-white" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending link..." : "Send magic link"}
                </Button>
              </form>

              <p className="text-center text-sm text-[#593C2D]/40">
                You'll receive a secure link to sign in
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
      </section>

      <Footer />
    </div>
  );
} 