import { create } from 'zustand';
import { getSession } from 'next-auth/react';
import { toast } from 'sonner';

export interface WishlistItem {
  _id: string;
  name: string;
  price: string;
  size: string;
  image: string;
  category: string;
  isAvailable?: boolean;
  addedAt?: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  isInitialized: boolean;
  loadingItems: Set<string>;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  fetchItems: () => Promise<void>;
  isInWishlist: (itemId: string) => boolean;
  isItemLoading: (itemId: string) => boolean;
  initializeWishlist: () => Promise<void>;
}

export const useWishlist = create<WishlistStore>()((set, get) => ({
  items: [],
  isLoading: false,
  isInitialized: false,
  loadingItems: new Set<string>(),

  isItemLoading: (itemId: string) => {
    return get().loadingItems.has(itemId);
  },

  isInWishlist: (itemId: string) => {
    return get().items.some(item => item._id === itemId);
  },

  fetchItems: async () => {
    try {
      const session = await getSession();
      if (!session) {
        set({ items: [], isInitialized: true });
        return;
      }

      set({ isLoading: true });
      const response = await fetch('/api/wishlist', {
        cache: 'no-store' // Disable caching to always get fresh data
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      set({ items: data.items || [], isInitialized: true });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      set({ items: [], isInitialized: true }); // Still mark as initialized even on error
      toast.error('Failed to load wishlist items');
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    try {
      const session = await getSession();
      if (!session) {
        toast.error('Please login to add items to wishlist');
        return;
      }

      // Add item to loading state
      set(state => ({
        loadingItems: new Set(state.loadingItems).add(item._id)
      }));

      // Check if product exists in store
      const productResponse = await fetch(`/api/products/${item._id}`);
      if (!productResponse.ok) {
        toast.error('This product is no longer available');
        return;
      }

      // Check if item is already in wishlist
      if (get().isInWishlist(item._id)) {
        toast.error('Item already in wishlist');
        return;
      }

      // Sync with database first
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...item, isAvailable: true }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400) {
          toast.error(data.message || 'Item already in wishlist');
          return;
        }
        throw new Error('Failed to add item to wishlist');
      }

      // Optimistically update UI
      set(state => ({
        items: [...state.items, { ...item, isAvailable: true }]
      }));

      toast.success('Item added to wishlist');
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Failed to add item to wishlist');
      // Revert optimistic update on error
      await get().fetchItems();
    } finally {
      // Remove item from loading state
      set(state => {
        const newLoadingItems = new Set(state.loadingItems);
        newLoadingItems.delete(item._id);
        return { loadingItems: newLoadingItems };
      });
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const session = await getSession();
      if (!session) {
        toast.error('Please login to remove items from wishlist');
        return;
      }

      // Add item to loading state
      set(state => ({
        loadingItems: new Set(state.loadingItems).add(itemId)
      }));

      // Optimistically update UI
      const previousItems = get().items;
      set(state => ({
        items: state.items.filter(item => item._id !== itemId)
      }));

      // Sync with database
      const response = await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        set({ items: previousItems });
        throw new Error('Failed to remove item from wishlist');
      }

      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      // Remove item from loading state
      set(state => {
        const newLoadingItems = new Set(state.loadingItems);
        newLoadingItems.delete(itemId);
        return { loadingItems: newLoadingItems };
      });
    }
  },

  clearWishlist: async () => {
    try {
      const session = await getSession();
      if (!session) {
        toast.error('Please login to clear wishlist');
        return;
      }

      set({ isLoading: true });

      // Sync with database first
      const response = await fetch('/api/wishlist/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear wishlist');
      }

      // Update UI after successful database update
      set({ items: [] });
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      set({ isLoading: false });
    }
  },

  initializeWishlist: async () => {
    const state = get();
    if (!state.isInitialized && !state.isLoading) {
      await state.fetchItems();
    }
  },
}));
