'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { NavItem } from '@/components/ui/nav-item';

import { NavDropdown } from '@/components/ui/nav-dropdown';
import { navigationItems } from '@/config/navigation';

export default function Navbar() {
  const { data: session } = useSession();

  // Filter out the Shop button to add it last
  const regularNavItems = navigationItems.filter(item => !item.isButton);
  const shopButton = navigationItems.find(item => item.isButton);

  return (
    <div className=" z-[100]">
      <div className="flex items-center justify-between px-8 py-4 lg:max-w-[75vw] mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-[90px]">
            <Image
              src="/logo.png"
              alt="Shimmer Logo"
              width={120}
              height={120}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex z-[101] items-center gap-6">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-2 rounded-full flex items-center gap-6">
            {regularNavItems.map((item, idx) => (
              <NavItem
                key={idx}
                href={item.link}
                label={item.name}
                iconName={item.iconName}
                showBadge={item.showBadge}
              />
            ))}
            <NavDropdown
              navItems={navigationItems}
              session={session}
              variant="floating"
            />
            {shopButton && (
              <NavItem
                href={shopButton.link}
                label={shopButton.name}
                isButton={shopButton.isButton}
              />
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <NavDropdown
            navItems={navigationItems}
            isMobile
            triggerIcon="menu"
            session={session}
          />
        </div>
      </div>
    </div>
  );
}
