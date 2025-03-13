import { PageHero } from "../pageHero";

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
                title="About Us" 
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." 
            />
            <h1>About Us</h1>
        </div>
    )
} 