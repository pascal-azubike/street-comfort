import { generateMetadata } from '@/app/lib/metadata';
import { PageHero } from "../pageHero"
import { ContactForm } from "./components/contact-form"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

export const metadata = generateMetadata({
  title: "Contact Street Comfort | Get in Touch",
  description: "Contact Street Comfort for inquiries about our Nigerian streetwear collection, collaborations, or customer support. We're here to help with all your fashion needs.",
  pathname: '/contact-us',
})

export default function ContactPage() {
  return (
    <div className="bg-[#FDF7F5]">
      <PageHero
        title="Contact Us"
        description="Get in touch with us for any inquiries about our streetwear collection or services."
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#593C2D]/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#593C2D]" />
              </div>
              <h3 className="text-lg font-semibold text-[#593C2D] mb-2">Phone</h3>
              <p className="text-[#593C2D]/60 mb-4">Mon-Fri from 8am to 5pm.</p>
              <p className="text-[#593C2D] font-medium hover:text-[#462901] cursor-pointer transition-colors">
                +234 806 028 3727
              </p>
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#593C2D]/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#593C2D]" />
              </div>
              <h3 className="text-lg font-semibold text-[#593C2D] mb-2">Address</h3>
              <p className="text-[#593C2D]/60 mb-4">Visit our store.</p>
              <p className="text-[#593C2D] font-medium">Jl. Wilis no.13, Lagos</p>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#593C2D]/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#593C2D]" />
              </div>
              <h3 className="text-lg font-semibold text-[#593C2D] mb-2">Email</h3>
              <p className="text-[#593C2D]/60 mb-4">Contact us anytime.</p>
              <p className="text-[#593C2D] font-medium hover:text-[#462901] cursor-pointer transition-colors">
                shimmer.info@mail.com
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#593C2D]/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#593C2D]" />
              </div>
              <h3 className="text-lg font-semibold text-[#593C2D] mb-2">Working Hours</h3>
              <p className="text-[#593C2D]/60 mb-4">Open Week Days</p>
              <p className="text-[#593C2D] font-medium">7 PM - 9 AM, Mon - Sat</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-['Playfair_Display'] text-[#462901] mb-4">
                Send Us Message
              </h2>
              <p className="text-[#462901]/60">
                We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
