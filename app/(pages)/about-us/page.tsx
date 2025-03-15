import { PageHero } from "../pageHero";
import Image from "next/image";
import { generateMetadata } from '@/app/lib/metadata';

export const metadata = generateMetadata({
  title: "About Street Comfort | Nigerian Streetwear Brand",
  description: "Learn about Street Comfort, Nigeria's leading streetwear brand combining urban culture with modern design. Discover our story, values, and commitment to authentic Nigerian fashion.",
  pathname: '/about-us',
})

export default function AboutUs() {
  return (
    <div>
      <PageHero 
        title="Our Story" 
        description="Crafting authentic Nigerian streetwear with style and purpose." 
      />
      
      {/* Vision Section */}
      <section className="py-20 relative">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-['Playfair_Display'] text-[#593C2D]">
                  Our Vision
                </h2>
                <p className="text-[#593C2D]/60 leading-relaxed">
                  Street Comfort was born from a simple yet powerful idea: to create streetwear that truly represents Nigerian urban culture while maintaining the highest standards of comfort and quality. We believe that fashion should be both expressive and accessible.
                </p>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/about-vision.jpg"
                  alt="Street Comfort Vision"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-20 bg-gradient-to-b from-[#593C2D]/20 to-transparent" />
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#F3E6DC]/30 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5">
          <div className="w-4 h-4 rounded-full bg-[#593C2D]/10 absolute -top-2 left-1/2 transform -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-['Playfair_Display'] text-[#593C2D] text-center mb-16">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#593C2D]/10 flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-['Playfair_Display'] text-[#593C2D]">
                    {value.title}
                  </h3>
                  <p className="text-[#593C2D]/60">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-20 bg-gradient-to-b from-[#593C2D]/20 to-transparent" />
          <div className="w-4 h-4 rounded-full bg-[#593C2D]/10 absolute bottom-0 left-1/2 transform -translate-x-1/2" />
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-20 bg-gradient-to-t from-[#593C2D]/20 to-transparent" />
          <div className="w-4 h-4 rounded-full bg-[#593C2D]/10 absolute top-0 left-1/2 transform -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-['Playfair_Display'] text-[#593C2D]">
              Our Commitment
            </h2>
            <p className="text-[#593C2D]/60 max-w-2xl mx-auto leading-relaxed">
              We're committed to creating clothing that not only looks good but feels good too. Every piece is crafted with attention to detail, using quality materials that stand the test of time. We believe in sustainable fashion that's kind to both people and the planet.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl font-['Playfair_Display'] text-[#593C2D]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#593C2D]/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#593C2D]/20 to-transparent" />
      </section>
    </div>
  );
}

const values = [
  {
    icon: '🎨',
    title: 'Authentic Design',
    description: 'Every piece tells a story of Nigerian creativity and urban culture.',
  },
  {
    icon: '✨',
    title: 'Quality First',
    description: 'We use premium materials and craftsmanship in every garment.',
  },
  {
    icon: '🌍',
    title: 'Sustainable Fashion',
    description: 'Creating fashion that respects both people and the environment.',
  },
];

const stats = [
  { value: '5K+', label: 'Happy Customers' },
  { value: '100+', label: 'Unique Designs' },
  { value: '24/7', label: 'Customer Support' },
  { value: '98%', label: 'Satisfaction Rate' },
]; 