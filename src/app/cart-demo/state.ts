"use client";

import { useEffect, useMemo, useState } from "react";

export type Product = {
  id: string;
  name: string;
  image: string;
  description?: string;
};

export type CartItem = {
  id: string;
  name: string;
  image?: string;
  qty: number;
};

const STORAGE_KEY = "cart-demo-v1";

function readFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x) => x && typeof x.id === "string" && typeof x.name === "string" && typeof x.qty === "number"
    );
  } catch {
    return [];
  }
}

function writeToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function useCartDemo() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = readFromStorage();
    setItems(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeToStorage(items);
  }, [items, hydrated]);

  const add = (p: Product, qty = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === p.id);
      if (index !== -1) {
        const next = prev.slice();
        next[index] = { ...next[index], qty: next[index].qty + qty };
        return next;
      }
      return [...prev, { id: p.id, name: p.name, image: p.image, qty }];
    });
  };

  const setQty = (id: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty } : i));
    });
  };

  const remove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRemovingId((curr) => (curr === id ? null : curr));
    }, 220);
  };

  const clear = () => setItems([]);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  return { items, add, setQty, remove, clear, totalCount, removingId, hydrated };
}


