export const navigationItems = [
  { name: 'Blog', link: '/blog' },
  { name: 'FAQ', link: '/faq' },
  { name: 'Contact Us', link: '/contact-us' },
  {
    name: 'Cart',
    link: '/cart',
    iconName: 'ShoppingBag',
    showBadge: true, // This will be used to show the cart count
  },
  { name: 'Shop', link: '/shop', isButton: true },
];

export type NavigationItem = {
  name: string;
  link: string;
  iconName?: string;
  isButton?: boolean;
  showBadge?: boolean;
};
