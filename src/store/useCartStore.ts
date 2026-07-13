import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: number;
  image: string;
  size?: string;
  subtext?: string;
  quantity: number;
}

export interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      
      // UI Controls
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Cart Logic
      addToCart: (newItem) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.variantId === newItem.variantId);

        if (existingItem) {
          // If it's already in the bag, just increase the quantity
          const updatedCart = cart.map((item) =>
            item.variantId === newItem.variantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({ cart: updatedCart, isOpen: true });
        } else {
          // If it's new, add it to the bag
          set({ cart: [...cart, { ...newItem, quantity: 1 }], isOpen: true });
        }
      },

      removeFromCart: (variantId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.variantId !== variantId),
        }));
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'mouleeta-cart-storage', // This saves the cart to the browser's LocalStorage!
    }
  )
);
