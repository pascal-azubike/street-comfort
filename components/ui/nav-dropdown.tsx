"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Package, ShoppingBag, Heart, Settings, LogOut, LayoutDashboard, Users, ClipboardList, ShoppingCart, FileText, MapPin, Edit } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { NavItem } from "./nav-item";
import { cn } from "@/lib/utils";

interface ExtendedUser {
  role?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface ExtendedSession extends Session {
  user?: ExtendedUser
  expires: string
}

interface NavDropdownProps {
  navItems: {
    name: string;
    link: string;
    isButton?: boolean;
    iconName?: string;
    showBadge?: boolean;
  }[];
  isMobile?: boolean;
  triggerIcon?: "menu" | "user";
  className?: string;
  session?: ExtendedSession | null;
  variant?: 'default' | 'floating';
}

const userMenuItems = [
  {
    label: "Profile",
    href: "/profile",
    icon: User
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Package
  },
  {
    label: "Addresses",
    href: "/addresses",
    icon: MapPin
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart
  }
];

const adminMenuItems = [
  {
    label: "Create Blog",
    href: "/blog/create",
    icon: FileText
  },
  {
    label: "Create Product",
    href: "/products/create",
    icon: Package
  },
  {
    label: "Manage Product",
    href: "/products/manage",
    icon: Edit
  },
  {
    label: "Orders",
    href: "/manage-orders",
    icon: ClipboardList
  },
  {
    label: "Users",
    href: "/users/manage",
    icon: Users
  }
];

export function NavDropdown({ 
  navItems, 
  isMobile, 
  triggerIcon = "user", 
  className, 
  session,
  variant = 'default' 
}: NavDropdownProps) {
  const router = useRouter();

  // If not mobile and not logged in, render sign in button
  if (!isMobile && !session?.user) {
    return (
      <Button
        variant="ghost"
        onClick={() => signIn()}
        className={cn(
          "hover:bg-white/10 transition border",
          variant === 'floating' 
            ? "text-white border-white/20 hover:text-white" 
            : "text-[#593C2D] border-[#593C2D] bg-white/80"
        )}
      >
        Sign In
      </Button>
    );
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Mobile menu uses Sheet (Drawer)
  if (isMobile) {
    return (
      <Sheet>
       
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:bg-white/10 transition border",
              variant === 'floating' ? "text-white" : "text-[#593C2D]"
            )}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80 p-0 bg-white border-l border-[#593C2D]/10 z-[9101]">
          <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-4">
              {/* User Section */}
              {session?.user ? (
                <div className="flex items-center mb-4 gap-3 pb-3 border-b border-[#593C2D]/10">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ''} />
                    <AvatarFallback className="bg-[#593C2D] text-white text-sm">
                      {session.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#593C2D] text-sm font-['Segoe_UI']">{session.user.name}</p>
                    <p className="text-xs text-[#593C2D]/60 font-['Segoe_UI']">{session.user.email}</p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => signIn()}
                  className="w-full bg-[#593C2D] text-white hover:bg-[#593C2D]/90 text-sm font-['Segoe_UI']"
                >
                  Sign In
                </Button>
              )}

              {/* Navigation Items */}
              <div className="space-y-3">
                {navItems.map((item, idx) => (
                  <NavItem
                    key={idx}
                    href={item.link}
                    label={item.name}
                    isButton={item.isButton}
                    iconName={item.iconName}
                    showBadge={item.showBadge}
                    className="w-full justify-start text-sm"
                  />
                ))}
              </div>

              {session?.user && (
                <>
                  {/* Admin Section */}
                  {session.user.role === 'admin' && (
                    <>
                      <div className="pt-3 border-t border-[#593C2D]/10">
                        <p className="text-xs font-medium text-[#593C2D]/60 mb-2 font-['Segoe_UI']">Admin</p>
                        <div className="space-y-1">
                          {adminMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="w-full text-left px-3 py-2 rounded-lg text-[#593C2D] hover:bg-[#593C2D]/5 transition-colors flex items-center gap-2 text-sm font-['Segoe_UI']"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* User Menu Items */}
                  <div className="pt-3 border-t border-[#593C2D]/10">
                    <p className="text-xs font-medium text-[#593C2D]/60 mb-2 font-['Segoe_UI']">Account</p>
                    <div className="space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="w-full text-left px-3 py-2 rounded-lg text-[#593C2D] hover:bg-[#593C2D]/5 transition-colors flex items-center gap-2 text-sm font-['Segoe_UI']"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-3 border-t border-[#593C2D]/10">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-['Segoe_UI']"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop menu uses NavigationMenu
  return (
    <NavigationMenu className="z-[9999999999]">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {session?.user?.image ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image} />
                <AvatarFallback className="bg-[#593C2D] text-white">
                  {session.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#593C2D] text-white flex items-center justify-center text-sm font-medium">
                {session?.user?.name?.charAt(0)}
              </div>
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-56 p-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* User Info */}
              <div className="px-2 py-3 mb-2">
                <p className="text-sm font-medium text-[#593C2D]">{session?.user?.name}</p>
                <p className="text-xs text-[#593C2D]/60">{session?.user?.email}</p>
              </div>

              {/* Admin Section */}
              {session?.user?.role === 'admin' && (
                <>
                  <div className="text-xs font-['Segoe_UI'] font-semibold text-[#593C2D]/60 mb-2 px-2">
                    Admin
                  </div>
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[#593C2D] hover:bg-[#593C2D]/10 transition-colors flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-['Segoe_UI']">{item.label}</span>
                    </Link>
                  ))}
                  <div className="h-px bg-[#593C2D]/10 my-2" />
                </>
              )}

              {/* User Section */}
              <div className="text-xs font-['Segoe_UI'] font-semibold text-[#593C2D]/60 mb-2 px-2">
                Account
              </div>
              {userMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-[#593C2D] hover:bg-[#593C2D]/10 transition-colors flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-['Segoe_UI']">{item.label}</span>
                </Link>
              ))}

              {/* Sign Out Button */}
              <div className="h-px bg-[#593C2D]/10 my-2" />
              <button
                className="w-full text-left px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <span className="font-['Segoe_UI']">Sign out</span>
              </button>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
} 