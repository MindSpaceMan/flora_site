// src/app/components/HeaderCart.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export default function HeaderCart() {
    const count = useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

    return (
        <Link href="/cart" className="relative inline-flex items-center gap-2">
            <span>Корзина</span>
            {count > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#CD8567] px-2 text-white text-xs">
          {count}
        </span>
            )}
        </Link>
    );
}