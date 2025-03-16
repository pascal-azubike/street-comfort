import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSession } from 'next-auth/react';
import { toast } from 'sonner';

export interface wishListItem {
  _id: string;
  name: string;
  price: string;
  size: string;
  image: string;
  category: string;
  isAvailable?: boolean;
}

interface wishListStore {
  items: wishListItem[];
  isLoading: boolean;
  isInitialized: boolean;
  addItem: (item: wishListItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearwishList: () => Promise<void>;
  fetchItems: () => Promise<void>;
  isInWishlist: (itemId: string) => boolean;
  initializeWishlist: () => Promise<void>;
}

export const usewishList = create<wishListStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isInitialized: false,

      fetchItems: async () => {
        try {
          const session = await getSession();
          if (!session) {
            set({ items: [] });
            return;
          }

          const response = await fetch('/api/wishlist');
          const data = await response.json();
          set({ items: data });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
          toast.error('Failed to load wishlist items');
        }
      },

      addItem: async (item) => {
        try {
          const session = await getSession();
          if (!session) {
            toast.error('Please login to add items to wishlist');
            return;
          }

          // Check if product exists in store
          const productResponse = await fetch(`/api/products/${item._id}`);
          if (!productResponse.ok) {
            toast.error('This product is no longer available');
            return;
          }

          // Optimistically update UI
          const currentItems = get().items;
          set({ items: [...currentItems, { ...item, isAvailable: true }] });
          
          // Sync with database
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...item, isAvailable: true }),
          });

          if (!response.ok) {
            // Revert on error
            set({ items: currentItems });
            throw new Error('Failed to add item to wishlist');
          }

          toast.success('Item added to wishlist');
        } catch (error) {
          console.error('Failed to add item:', error);
          toast.error('Failed to add item to wishlist');
        }
      },

      removeItem: async (itemId: string) => {
        try {
          const session = await getSession();
          if (!session) {
            toast.error('Please login to remove items from wishlist');
            return;
          }

          // Optimistically update UI
          const currentItems = get().items;
          const newItems = currentItems.filter(item => item._id !== itemId);
          set({ items: newItems });

          // Sync with database
          const response = await fetch('/api/wishlist/remove', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId }),
          });

          if (!response.ok) {
            // Revert on error
            set({ items: currentItems });
            throw new Error('Failed to remove item from wishlist');
          }

          toast.success('Item removed from wishlist');
        } catch (error) {
          console.error('Failed to remove item:', error);
          toast.error('Failed to remove item from wishlist');
        }
      },

      clearwishList: async () => {
        try {
          const session = await getSession();
          if (!session) {
            toast.error('Please login to clear wishlist');
            return;
          }

          // Optimistically update UI
          const currentItems = get().items;
          set({ items: [] });

          // Sync with database
          const response = await fetch('/api/wishlist/clear', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            // Revert on error
            set({ items: currentItems });
            throw new Error('Failed to clear wishlist');
          }

          toast.success('Wishlist cleared');
        } catch (error) {
          console.error('Failed to clear wishlist:', error);
          toast.error('Failed to clear wishlist');
        }
      },

      isInWishlist: (itemId: string) => {
        return get().items.some(item => item._id === itemId);
      },

      initializeWishlist: async () => {
        if (get().isInitialized) return;

        try {
          const response = await fetch('/api/wishlist');
          if (!response.ok) throw new Error('Failed to fetch wishlist');

          const items = await response.json();
          set({ items, isInitialized: true });
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          set({ isInitialized: true }); // Mark as initialized even on error
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
