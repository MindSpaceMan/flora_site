// src/store/cart.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
    /** productId в рамках slug */
    id: string;
    /** slug категории: /catalog/[slug]/[id] */
    slug: string;
    name: string;
    qty: number;
    image?: string;
};

type CartStore = {
    items: CartItem[];
    add: (item: Omit<CartItem, "qty">, qty?: number) => void;
    remove: (id: string) => void;
    setQty: (id: string, qty: number) => void;
    clear: () => void;
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            add: (item, qty = 1) => {
                const items = get().items.slice();
                const i = items.findIndex((x) => x.id === item.id);
                if (i !== -1) items[i] = { ...items[i], qty: items[i].qty + qty };
                else items.push({ ...item, qty });
                set({ items });
            },
            remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
            setQty: (id, qty) => {
                if (qty <= 0) return set({ items: get().items.filter((x) => x.id !== id) });
                set({ items: get().items.map((x) => (x.id === id ? { ...x, qty } : x)) });
            },
            clear: () => set({ items: [] }),
        }),
        {
            name: "cart-v1",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ items: s.items }),
        },
    ),
);