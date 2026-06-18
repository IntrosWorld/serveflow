import { create } from "zustand";
type CartItem = { id: string; name: string; price: number; quantity: number; note?: string };
type Cart = { items: CartItem[]; add: (item: Omit<CartItem, "quantity">) => void; remove: (id: string) => void; clear: () => void; total: () => number };
export const useCart = create<Cart>((set, get) => ({
  items: [],
  add: (item) => set((state) => ({ items: state.items.some((x) => x.id === item.id) ? state.items.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x) : [...state.items, { ...item, quantity: 1 }] })),
  remove: (id) => set((state) => ({ items: state.items.flatMap((x) => x.id !== id ? [x] : x.quantity > 1 ? [{ ...x, quantity: x.quantity - 1 }] : []) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
