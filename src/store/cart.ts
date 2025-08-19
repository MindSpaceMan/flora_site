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
    /** Время добавления для сортировки */
    addedAt: number;
};

type CartStore = {
    items: CartItem[];
    add: (item: Omit<CartItem, "qty" | "addedAt">, qty?: number) => void;
    remove: (id: string) => void;
    setQty: (id: string, qty: number) => void;
    clear: () => void;
    getItemCount: () => number;
    getItemById: (id: string) => CartItem | undefined;
    isInCart: (id: string) => boolean;
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            
            add: (item, qty = 1) => {
                const items = get().items.slice();
                const existingIndex = items.findIndex((x) => x.id === item.id);
                
                if (existingIndex !== -1) {
                    // Если товар уже в корзине, увеличиваем количество
                    items[existingIndex] = { 
                        ...items[existingIndex], 
                        qty: items[existingIndex].qty + qty 
                    };
                } else {
                    // Добавляем новый товар
                    items.push({ 
                        ...item, 
                        qty,
                        addedAt: Date.now()
                    });
                }
                
                set({ items });
            },
            
            remove: (id) => set({ 
                items: get().items.filter((x) => x.id !== id) 
            }),
            
            setQty: (id, qty) => {
                if (qty <= 0) {
                    get().remove(id);
                } else {
                    set({ 
                        items: get().items.map((x) => 
                            x.id === id ? { ...x, qty } : x
                        ) 
                    });
                }
            },
            
            clear: () => set({ items: [] }),
            
            getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
            
            getItemById: (id) => get().items.find(item => item.id === id),
            
            isInCart: (id) => get().items.some(item => item.id === id),
        }),
        {
            name: "cart-v1",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ items: s.items }),
        },
    ),
);