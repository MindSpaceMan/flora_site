// src/app/components/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { Button } from "@/app/components/ui/button";
import { Check, ShoppingCart, Plus } from "lucide-react";

type Props = {
    id: string;       // productId
    slug: string;     // категория (из URL)
    name: string;
    image?: string;
    qty?: number;
    className?: string;
};

export default function AddToCartButton({ id, slug, name, image, qty = 1, className }: Props) {
    const add = useCart((s) => s.add);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        
        // Имитация задержки для лучшего UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        add({ id, slug, name, image }, qty);
        
        setIsAdding(false);
        setShowSuccess(true);
        
        // Сброс состояния успеха через 2 секунды
        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                className ?? "bg-[#CD8567] hover:bg-[#B8714C] text-white"
            }`}
        >
            {/* Animated background */}
            <div className={`absolute inset-0 bg-green-500 transform transition-transform duration-500 ${
                showSuccess ? 'translate-x-0' : 'translate-x-full'
            }`} />
            
            {/* Content */}
            <div className="relative flex items-center gap-2">
                {isAdding ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Добавление...</span>
                    </>
                ) : showSuccess ? (
                    <>
                        <Check className="w-4 h-4" />
                        <span>Добавлено!</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>В корзину</span>
                    </>
                )}
            </div>
            
            {/* Ripple effect */}
            {isAdding && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded" />
            )}
        </Button>
    );
}