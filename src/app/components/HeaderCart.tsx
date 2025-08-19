// src/app/components/HeaderCart.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";

export default function HeaderCart() {
    const count = useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
    const [hasMounted, setHasMounted] = useState(false);
    const [prevCount, setPrevCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted && count > prevCount) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
        setPrevCount(count);
    }, [count, prevCount, hasMounted]);

    return (
        <Link href="/cart" className="relative inline-flex items-center gap-2 group">
            <div className="relative">
                <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                
                {/* Animated notification dot */}
                {hasMounted && count > 0 && (
                    <div className={`absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full transition-all duration-300 ${
                        isAnimating ? 'scale-150' : 'scale-100'
                    }`} />
                )}
            </div>
            
            <span className="font-medium">Корзина</span>
            
            {/* Animated counter */}
            {hasMounted && count > 0 && (
                <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#CD8567] px-2 text-white text-xs font-medium transition-all duration-300 ${
                    isAnimating ? 'scale-125 bg-red-500' : 'scale-100'
                }`}>
                    {count}
                </span>
            )}
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-[#CD8567]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Link>
    );
}