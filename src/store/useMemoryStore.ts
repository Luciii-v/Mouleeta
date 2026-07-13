import { create } from 'zustand';

export interface MemoryItem {
  id: string;
  handle: string;
  title: string;
  image: string;
  price: number;
}

interface MemoryStore {
  items: MemoryItem[];
  addRecentItem: (item: MemoryItem) => void;
  removeRecentItem: (id: string) => void;
  clearMemory: () => void;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  items: [],
  addRecentItem: (item) =>
    set((state) => {
      // Don't add if it's already the most recent item
      if (state.items.length > 0 && state.items[0].id === item.id) {
        return state;
      }
      
      // Filter out if it exists elsewhere in the history and prepend it
      const filtered = state.items.filter((i) => i.id !== item.id);
      
      // Keep only up to 5 items in memory
      const newItems = [item, ...filtered].slice(0, 5);
      return { items: newItems };
    }),
  removeRecentItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  clearMemory: () => set({ items: [] }),
}));
