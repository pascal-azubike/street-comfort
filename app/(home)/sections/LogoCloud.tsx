import Image from "next/image"

const logos = [
  {
    src: "/logo-1.png",
    alt: "Company Logo 1",
  },
  {
    src: "/logo-2.png",
    alt: "Company Logo 2",
  },
  {
    src: "/logo-3.png",
    alt: "Company Logo 3",
  },
  {
    src: "/logo-4.png",
    alt: "Company Logo 4",
  },
  {
    src: "/logo-3.png",
    alt: "Company Logo 5",
  },
]

// Duplicate logos for seamless scrolling
const duplicatedLogos = [...logos, ...logos]

export default function LogoCloud() {
  return (
    <section className="bg-[#F7F1EA] py-8 overflow-hidden relative -z-[1]">
      <div className="relative max-w-6xl mx-auto inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="flex items-center justify-center md:justify-start [&_img]:max-w-none animate-infinite-scroll">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="w-32 h-12 relative mx-8 transition-all duration-300 flex-none"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center md:justify-start [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="w-32 h-12 relative mx-8 transition-all duration-300 flex-none"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 