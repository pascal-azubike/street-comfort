'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/use-cart';
import { ShoppingCart, HeartIcon, LucideIcon, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usewishList } from '@/store/use-wishlist';

const IconMap: Record<string, LucideIcon> = {
  ShoppingBag: ShoppingCart,
  HeartIcon: HeartIcon,
};

interface NavItemProps {
  href: string;
  label: string;
  className?: string;
  isButton?: boolean;
  iconName?: string;
  showBadge?: boolean;
  variant?: 'default' | 'floating';
}

export function NavItem({
  href,
  label,
  className,
  isButton,
  iconName,
  showBadge,
  variant = 'default'
}: NavItemProps) {
  const { items, isLoading } = useCart();

  // Calculate total quantity across all items
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const Icon = iconName ? IconMap[iconName] : undefined;

  const baseStyles = "transition text-sm font-medium font-['Segoe_UI'] ";
  const linkStyles = isButton
    ? 'bg-[#5C4434] text-white hover:bg-[#5C4434]/90 rounded-full px-6 py-2'
    : variant === 'floating'
      ? 'text-white hover:text-white/90'
      : 'text-[#5C4434] hover:text-[#5C4434]/80';

  return (
    <Link
      href={href}
      className={cn(
        baseStyles,
        linkStyles,
        'flex items-center gap-2 relative',
        !isButton && 'hover:bg-[#593C2D]/5 px-4 py-2 lg:px-1  rounded-lg',
        className
      )}
    >
      <span className="font-['Segoe_UI']">{label}</span>
      {Icon && (
        <div className="relative inline-flex">
          {isLoading && iconName === 'ShoppingBag' ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#5C4434]" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
          {showBadge && itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#B68C66] text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {itemCount}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
