import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { getSession } from 'next-auth/react';

export interface CartItem {
  _id: string;
  name: string;
  price: string;
  quantity: number;
  size: string;
  image: string;
  description: string;
  category: string;
  details: Array<{
    key: string;
    value: string;
  }>;
  images: string[];
}

type ProcessingItem = {
  id: string;
  action: 'remove' | 'update';
};

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  processingItems: ProcessingItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  syncWithDatabase: () => Promise<void>;
  mergeWithDatabaseCart: () => Promise<CartItem[]>;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
}

// Helper function to handle errors consistently
const handleStoreError = (error: any, action: string) => {
  console.error(`Failed to ${action}:`, error);
  toast.error(`Failed to ${action}. Please try again.`, {
    style: {
      background: '#fee2e2',
      border: '1px solid #ef4444',
      color: '#dc2626',
    },
  });
};

const isUserLoggedIn = async () => {
  const session = await getSession();
  return session?.user?.id !== undefined;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      processingItems: [] as ProcessingItem[],
      isAuthenticated: false, // Default is false
      setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),

      setItems: items => set({ items }),

      addItem: async item => {
        const previousItems = get().items;

        set(state => {
          const existingItem = state.items.find(
            i => i._id === item._id && i.size === item.size
          );

          const newItems = existingItem
            ? state.items.map(i =>
                i._id === item._id && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            : [...state.items, item];

          return { items: newItems, isLoading: true };
        });

        try {
          if (get().isAuthenticated) {
            await get().syncWithDatabase();
          }
          set({ isLoading: false });
          toast.success('Item added to cart');
        } catch (error) {
          set({ items: previousItems, isLoading: false });
          handleStoreError(error, 'add item to cart');
        }
      },

      removeItem: async itemId => {
        const previousItems = get().items;
        const currentProcessingItems = Array.isArray(get().processingItems)
          ? get().processingItems
          : [];

        set({
          processingItems: [
            ...currentProcessingItems,
            { id: itemId, action: 'remove' as const },
          ],
        });

        try {
          if (get().isAuthenticated) {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: get().items.filter(item => item._id !== itemId),
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to sync cart with database');
            }
          }

          set({
            items: get().items.filter(item => item._id !== itemId),
            processingItems: get().processingItems.filter(
              item => item.id !== itemId
            ),
          });

          toast.success('Item removed from cart');
        } catch (error) {
          set({
            items: previousItems,
            processingItems: get().processingItems.filter(
              item => item.id !== itemId
            ),
          });
          handleStoreError(error, 'remove item from cart');
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const previousItems = get().items;
        const currentProcessingItems = Array.isArray(get().processingItems)
          ? get().processingItems
          : [];

        set({
          processingItems: [
            ...currentProcessingItems,
            { id: itemId, action: 'update' as const },
          ],
        });

        try {
          console.log(get().isAuthenticated, 'is authenticated');
          if (get().isAuthenticated) {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: get().items.map(item =>
                  item._id === itemId ? { ...item, quantity } : item
                ),
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to sync cart with database');
            }
          }

          set({
            items: get().items.map(item =>
              item._id === itemId ? { ...item, quantity } : item
            ),
            processingItems: get().processingItems.filter(
              item => item.id !== itemId
            ),
          });

          toast.success('Cart updated');
        } catch (error) {
          set({
            items: previousItems,
            processingItems: get().processingItems.filter(
              item => item.id !== itemId
            ),
          });
          handleStoreError(error, 'update cart');
        }
      },

      clearCart: async () => {
        const previousItems = get().items;

        try {
          if (get().isAuthenticated) {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: [] }),
            });

            if (!response.ok) {
              throw new Error('Failed to clear cart');
            }
          }

          set({ items: [] });
          toast.success('Cart cleared');
        } catch (error) {
          set({ items: previousItems });
          handleStoreError(error, 'clear cart');
        }
      },

      syncWithDatabase: async () => {
        console.log('syncing cart with database');
        if (!get().isAuthenticated) return;
        try {
          console.log(get().isAuthenticated);
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: get().items }),
          });

          if (!response.ok) {
            throw new Error('Failed to sync cart with database');
          }
        } catch (error) {
          handleStoreError(error, 'sync cart');
          throw error;
        }
      },

      mergeWithDatabaseCart: async () => {
        if (!get().isAuthenticated) return get().items;

        try {
          const response = await fetch('/api/cart');
          if (!response.ok) {
            throw new Error('Failed to fetch database cart');
          }

          const { items: dbItems } = await response.json();
          const localItems = get().items;

          const itemMap = new Map();

          localItems.forEach(item => {
            const key = `${item._id}-${item.size}`;
            itemMap.set(key, { ...item });
          });

          dbItems.forEach((dbItem: CartItem) => {
            const key = `${dbItem._id}-${dbItem.size}`;
            console.log(dbItems, 'dbItems');
            console.log(localItems, 'localItems');

            if (itemMap.has(key)) {
              const localItem = itemMap.get(key);
              itemMap.set(key, {
                ...dbItem,
                quantity: Math.max(localItem.quantity, dbItem.quantity),
              });
            } else {
              itemMap.set(key, { ...dbItem });
            }
          });

          const mergedItems = Array.from(itemMap.values());
          set({ items: mergedItems });
          get().syncWithDatabase();
          return mergedItems;
        } catch (error) {
          handleStoreError(error, 'sync cart with your account');
          return get().items;
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        items: state.items,
        processingItems: state.processingItems,
      }),
      onRehydrateStorage: () => (state, error) => {
        // Return a function that receives the store's set method
        return (storeSet: any) => {
          // Ensure processingItems is an array after rehydration
          if (!Array.isArray(state?.processingItems)) {
            storeSet({ processingItems: [] });
          }
        };
      },
    }
  )
);

// Initialize the authentication status when the store is created
const checkAuthentication = async () => {
  const isAuthenticated = await isUserLoggedIn();
  useCart.getState().setIsAuthenticated(isAuthenticated);
};

// Call the checkAuthentication function to set the initial authentication state
checkAuthentication();
