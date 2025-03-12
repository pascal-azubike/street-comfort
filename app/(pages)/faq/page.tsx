import { PageHero } from "../pageHero";
import { FAQContent } from "@/components/faq/faq-content";

export default function FAQ() {
    return (
        <div>
            <PageHero 
                title="FAQ" 
                description="Find answers to all your questions about our jewelry, services, and policies."
            />

            {/* FAQ Categories Intro */}
            <section className="py-16 bg-[#FDF7F5]">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#593C2D] mb-4">
                            How Can We Help You?
                        </h2>
                        <p className="text-[#593C2D]/60 font-['Segoe_UI'] leading-relaxed">
                            Browse through our comprehensive FAQ section to find answers to your questions. 
                            If you can't find what you're looking for, feel free to contact our support team.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <FAQContent />
                    </div>
                </div>
            </section>
        </div>
    )
} 