'use client'

import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Clock } from "lucide-react"
import { useReveal } from "@/hooks/useReveal"
import { collections } from "@/config/collections"

const helpLinks = [
  { title: "About Us", href: "/about-us" },
  { title: "Contact Us", href: "/contact-us" },
  { title: "Blogs", href: "/blog" },
  { title: "FAQ", href: "/faq" },
]

function SocialIcon({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center 
        hover:bg-white hover:text-[#462901] transform hover:-translate-y-1 
        transition-all duration-300 group"
    >
      <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
    </Link>
  )
}

export default function Footer() {
  const revealRef = useReveal()

  return (
    <footer className="bg-[#593C2D] font-['Segoe_UI'] text-white" ref={revealRef}>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Street Comfort',
          image: '/logo.png',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jl. Wilis no.13',
            addressLocality: 'Lagos',
            addressCountry: 'NG'
          },
          openingHours: 'Mo-Sa 09:00-19:00',
          telephone: '+234 806 028 3727',
          priceRange: '₦₦-₦₦₦'
        })}
      </script>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <div className="reveal delay-1 flex items-center gap-2 mb-4">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="websitelogo"
                  width={80}
                  height={80}
                />
              </Link>
            </div>
            <p className="reveal delay-2 font-roboto text-[14px] leading-[26px] text-white/80">
              Discover our premium streetwear collection that combines modern style with everyday comfort. Each piece is crafted to bring you the best in contemporary fashion.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 className="reveal delay-1 text-xl font-playfair mb-6">Our Collections</h3>
            <ul className="space-y-4">
              {collections.map((collection, index) => (
                <li key={collection.title} className={`reveal delay-${index + 2}`}>
                  <Link
                    href={`/shop?category=${collection.title.toLowerCase().replace(/\s+&\s+/g, '-')}`}
                    className="text-white/80 hover:text-white text-[14px] font-roboto transition-colors"
                  >
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="reveal delay-1 text-xl font-playfair mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {helpLinks.map((link, index) => (
                <li key={link.title} className={`reveal delay-${index + 2}`}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-[14px] font-roboto transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="reveal delay-1 text-xl font-playfair mb-6">Contact Us</h3>
            <div className="reveal delay-2 flex items-center gap-2 mb-4">
              <Clock size={18} className="text-white/80" />
              <p className="text-[14px] font-roboto">
                7 PM - 9 AM, Mon - Sat
              </p>
            </div>
            <p className="reveal delay-3 text-white/80 text-[14px] font-roboto leading-[26px] mb-6">
              Shop 8 Humanity complex Opposite Gilbert bank road, Ado Ekiti<br />
              Email: streetcomfort100@gmail.com<br />
              Phone: +234 806 028 3727
            </p>
            <div className="reveal delay-4 flex gap-4">
              <SocialIcon href="https://www.facebook.com/share/1AaRfPbwcr/?mibextid=LQQJ4d" icon={Facebook}  />
              <SocialIcon href=" https://www.tiktok.com/@streets.comfort?_r=1&_d=ef5jbla9a85fec&sec_uid=MS4wLjABAAAAT6nbU2V1QP2HvAT2lcPDwFH4DzTarWgJ1UYrx0GdZOgtjUXkdqnv-zYz2ttuAwFZ&share_author_id=7412996662284010502&sharer_language=en&source=h5_m&u_code=e1c1gfigf6aae0&ug_btm=b6880,b5836&sec_user_id=MS4wLjABAAAAEECZbiu9foQU72gssJJFxLX950FuljWp69jkx5ESPbiv4eksRnwTSh7AbYksJtug&utm_source=copy&social_share_type=5&utm_campaign=client_share&utm_medium=ios&tt_from=copy&user_id=7089928892009890822&enable_checksum=1&share_link_id=E321D190-C6A8-4052-8EEB-B039F9E7C5F6&share_app_id=1233" icon={Twitter} />
              <SocialIcon href=" https://www.instagram.com/dstreetcomfort?igsh=MXgwcGYwY202czJ1Nw==" icon={Instagram} />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#EBDBC2] py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-[#593C2D] text-sm font-roboto">
          © {new Date().getFullYear()} Street Comfort. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 