import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  image: string;
  subtext?: string;
}

export interface WishlistState {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (handle: string) => void;
  toggleWishlist: (item: WishlistItem) => boolean;
  isInWishlist: (handle: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (newItem) => {
        const wishlist = get().wishlist;
        if (!wishlist.some((item) => item.handle === newItem.handle)) {
          set({ wishlist: [...wishlist, newItem] });
        }
      },

      removeFromWishlist: (handle) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.handle !== handle),
        }));
      },

      toggleWishlist: (item) => {
        const wishlist = get().wishlist;
        const exists = wishlist.some((w) => w.handle === item.handle);
        if (exists) {
          get().removeFromWishlist(item.handle);
          return false;
        } else {
          get().addToWishlist(item);
          return true;
        }
      },

      isInWishlist: (handle) => {
        return get().wishlist.some((item) => item.handle === handle);
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'mouleeta-wishlist-storage',
    }
  )
);
