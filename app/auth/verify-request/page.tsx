"use client"

import { PageHero } from "@/app/(pages)/pageHero";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";


export default function VerifyRequest() {
  return (
    <div>
      <PageHero
        title="Check Your Email"
        description="We've sent you a magic link to sign in to your Street Comfort account."
      />

      <section className="py-20 relative min-h-screen">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl p-8 space-y-6 relative">
              <div className="w-16 h-16 rounded-full bg-[#F3E6DC] flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-[#593C2D]" />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-2xl font-['Playfair_Display'] text-[#593C2D]">
                  Magic Link Sent
                </h2>
                <p className="text-[#593C2D]/60 leading-relaxed">
                  Please check your email inbox for a secure link to sign in.
                  The link will expire in 24 hours for security reasons.
                </p>
              </div>

              <div className="pt-4 text-center">
                <p className="text-sm text-[#593C2D]/40 mb-4">
                  Can't find the email? Check your spam folder
                </p>
                <Button
                  variant="ghost"
                  onClick={() => signIn()}
                  className={cn(
                    "hover:bg-white/10 transition border"
                  )}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
      </section>

      <Footer/>
    </div>
  );
} 