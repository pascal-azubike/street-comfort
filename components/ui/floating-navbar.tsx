'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { NavItem } from './nav-item';
import { User, Menu, Home, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShopFilters } from '@/components/shop/shop-filters';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Session } from 'next-auth';

import { NavDropdown } from './nav-dropdown';
import { navigationItems } from '@/config/navigation';

interface ExtendedSession extends Session {
  user?: {
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isShopPage = pathname === '/shop';

  // Filter out the Shop button to add it last
  const regularNavItems = navigationItems.filter(item => !item.isButton);
  const shopButton = navigationItems.find(item => item.isButton);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 bg-[#593C2D] border-b border-white/20 z-[1000] transition-all duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="max-w-[90vw] lg:max-w-[75vw] mx-auto px-8 py-1 ">
        <div className="flex items-center lg:justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-[50px]">
              <Image
                src="/logo.png"
                alt="Shimmer Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <div className=" px-8 py-2 rounded-full flex items-center gap-6">
              {regularNavItems.map((item, idx) => (
                <NavItem
                  key={idx}
                  href={item.link}
                  label={item.name}
                  iconName={item.iconName}
                  showBadge={item.showBadge}
                  variant="floating"
                />
              ))}
              <NavDropdown
                navItems={navigationItems}
                session={session as ExtendedSession}
                variant="floating"
              />
              {shopButton && (
                <NavItem
                  href={shopButton.link}
                  label={shopButton.name}
                  isButton={shopButton.isButton}
                  variant="floating"
                />
              )}
            </div>
          </div>

          {/* Mobile Menu with Filter */}
          <div className="lg:hidden flex-1 flex items-center">
            {/* Empty div for spacing */}
            <div className="w-10" /> {/* This matches the width of the menu icon */}
            
            {/* Shop Filter Button - Mobile Only */}
            {isShopPage && (
              <div className="flex-1 flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline" size="sm" className="text-white bg-transparent border-white hover:text-white hover:bg-white/20">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-80 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20"
                  >
                    <ShopFilters 
                      variant="dropdown"
                      selectedCategory={['all']}
                      selectedSort="newest"
                      selectedSizes={[]}
                      onApplyFilters={({ category, sort, sizes }) => {
                        console.log({ category, sort, sizes });
                      }}
                      onResetFilters={() => {
                        console.log('Filters reset');
                      }}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Menu Icon - Always at the right */}
            <div className="ml-auto">
              <NavDropdown
                navItems={navigationItems}
                isMobile
                triggerIcon="menu"
                variant="floating"
                session={session as ExtendedSession}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
