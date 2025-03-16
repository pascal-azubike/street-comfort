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
  isAvailable?: boolean;
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
  checkAvailability: () => Promise<void>;
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
      isAuthenticated: false,
      setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),

      setItems: items => set({ items }),

      checkAvailability: async () => {
        const items = get().items;
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const response = await fetch(`/api/products/${item._id}`);
              return {
                ...item,
                isAvailable: response.ok
              };
            } catch (error) {
              console.error(`Failed to check availability for item ${item._id}:`, error);
              return {
                ...item,
                isAvailable: false
              };
            }
          })
        );
        set({ items: updatedItems });
      },

      addItem: async item => {
        const previousItems = get().items;

        try {
          // Check if product exists before adding
          const productResponse = await fetch(`/api/products/${item._id}`);
          if (!productResponse.ok) {
            toast.error('This product is no longer available');
            return;
          }

          set(state => {
            const existingItem = state.items.find(
              i => i._id === item._id && i.size === item.size
            );

            const newItems = existingItem
              ? state.items.map(i =>
                  i._id === item._id && i.size === item.size
                    ? { ...i, quantity: i.quantity + item.quantity, isAvailable: true }
                    : i
                )
              : [...state.items, { ...item, isAvailable: true }];

            return { items: newItems, isLoading: true };
          });

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

        // Check if item is available before updating quantity
        const item = get().items.find(i => i._id === itemId);
        if (item && item.isAvailable === false) {
          toast.error('This product is no longer available');
          return;
        }

        set({
          processingItems: [
            ...currentProcessingItems,
            { id: itemId, action: 'update' as const },
          ],
        });

        try {
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
              throw new Error('Failed to sync cart with database');
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
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: get().items }),
          });

          if (!response.ok) {
            throw new Error('Failed to sync cart with database');
          }
        } catch (error) {
          handleStoreError(error, 'sync cart with database');
        }
      },

      mergeWithDatabaseCart: async () => {
        try {
          const response = await fetch('/api/cart');
          if (!response.ok) {
            throw new Error('Failed to fetch cart from database');
          }

          const { items: databaseCart } = await response.json();
          const localCart = get().items;

          // Check availability for database items
          const databaseItemsWithAvailability = await Promise.all(
            (databaseCart || []).map(async (item: CartItem) => {
              try {
                const productResponse = await fetch(`/api/products/${item._id}`);
                return {
                  ...item,
                  isAvailable: productResponse.ok
                };
              } catch (error) {
                return {
                  ...item,
                  isAvailable: false
                };
              }
            })
          );

          // Merge carts, preferring database quantities for matching items
          const mergedItems = [...localCart];
          databaseItemsWithAvailability.forEach((dbItem: CartItem) => {
            const existingItemIndex = mergedItems.findIndex(
              i => i._id === dbItem._id && i.size === dbItem.size
            );
            if (existingItemIndex >= 0) {
              mergedItems[existingItemIndex] = {
                ...dbItem,
                quantity: dbItem.quantity,
              };
            } else {
              mergedItems.push(dbItem);
            }
          });

          return mergedItems;
        } catch (error) {
          handleStoreError(error, 'merge carts');
          return get().items;
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        items: state.items,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => state => {
        // Check authentication status when rehydrating
        if (state) {
          checkAuthentication().then(isAuthenticated => {
            state.setIsAuthenticated(isAuthenticated);
            state.checkAvailability();
          });
        }
      },
    }
  )
);

// Initialize the authentication status when the store is created
async function checkAuthentication() {
  try {
    const session = await getSession();
    return !!session?.user;
  } catch (error) {
    console.error('[AUTH_CHECK]', error);
    return false;
  }
}

// Call the checkAuthentication function to set the initial authentication state
checkAuthentication();
