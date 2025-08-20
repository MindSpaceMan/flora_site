// src/app/components/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useCart } from "@/store/cart";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps {
  id: string;
  slug: string;
  name: string;
  image?: string;
  qty?: number;
  className?: string;
}

export default function AddToCartButton({ 
  id, 
  slug, 
  name, 
  image, 
  qty = 1,
  className = "" 
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const add = useCart((s) => s.add);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    add({ id, slug, name, image }, qty);
    
    setIsAdding(false);
    setShowSuccess(true);
    
    // Hide success state after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (showSuccess) {
    return (
      <Button 
        disabled 
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      >
        <Check className="w-4 h-4 mr-2" />
        Добавлено в корзину
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`bg-[#CD8567] hover:bg-[#B8714C] text-white ${className}`}
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Добавление...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          В корзину
        </>
      )}
    </Button>
  );
}