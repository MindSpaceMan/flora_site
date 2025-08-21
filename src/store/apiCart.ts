"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  createCart as apiCreateCart,
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  type CartItem as ApiCartItem,
  type CartResponse,
} from "@/lib/api";

type ApiCartStore = {
  cartId: string | null;
  cartToken: string | null;
  items: ApiCartItem[];
  status: string | null;
  loading: boolean;
  error: string | null;
  // derived
  getItemCount: () => number;
  // actions
  initialize: () => Promise<void>;
  ensureCart: () => Promise<void>;
  sync: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string, quantity?: number) => Promise<void>;
  removeAllOfItem: (productId: string) => Promise<void>;
  clearLocal: () => void; // only local clear of items
};

export const useApiCart = create<ApiCartStore>()(
  persist(
    (set, get) => ({
      cartId: null,
      cartToken: null,
      items: [],
      status: null,
      loading: false,
      error: null,

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      initialize: async () => {
        const { cartId, cartToken } = get();
        if (cartId && cartToken) {
          await get().sync().catch(() => void 0);
        }
      },

      ensureCart: async () => {
        const { cartId, cartToken } = get();
        if (cartId && cartToken) return;
        set({ loading: true, error: null });
        try {
          const resp = await apiCreateCart();
          set({
            cartId: resp.cart.id,
            cartToken: resp.token,
            items: resp.cart.items || [],
            status: resp.cart.status,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Ошибка создания корзины";
          set({ error: message });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      sync: async () => {
        const { cartId, cartToken } = get();
        if (!cartId || !cartToken) return;
        set({ loading: true, error: null });
        try {
          const resp = await apiGetCart(cartId, cartToken);
          set({
            cartToken: resp.cartToken || cartToken,
            items: resp.cart.items || [],
            status: resp.cart.status,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Ошибка загрузки корзины";
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (productId: string, quantity: number = 1) => {
        await get().ensureCart();
        const { cartToken } = get();
        if (!cartToken) return;
        set({ loading: true, error: null });
        try {
          const resp: CartResponse = await apiAddToCart(cartToken, productId, quantity);
          set({
            cartId: resp.cart.id,
            cartToken: resp.token,
            items: resp.cart.items || [],
            status: resp.cart.status,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Ошибка добавления товара";
          set({ error: message });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      removeItem: async (productId: string, quantity: number = 1) => {
        await get().ensureCart();
        const { cartToken } = get();
        if (!cartToken) return;
        set({ loading: true, error: null });
        try {
          const resp: CartResponse = await apiRemoveFromCart(cartToken, productId, quantity);
          set({
            cartId: resp.cart.id,
            cartToken: resp.token,
            items: resp.cart.items || [],
            status: resp.cart.status,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Ошибка удаления товара";
          set({ error: message });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      removeAllOfItem: async (productId: string) => {
        const item = get().items.find((i) => i.product.id === productId);
        if (!item) return;
        await get().removeItem(productId, item.quantity);
      },

      clearLocal: () => set({ items: [] }),
    }),
    {
      name: "api-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cartId: s.cartId, cartToken: s.cartToken, items: s.items, status: s.status }),
    }
  )
);


