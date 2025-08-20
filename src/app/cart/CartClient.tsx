// src/app/cart/CartClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useCart } from "@/store/cart";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartClient() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Don't render cart content until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-medium mb-4">Загрузка корзины...</h1>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Корзина пуста</h1>
          <p className="text-gray-600 mb-6">Добавьте товары в корзину для оформления заказа</p>
          <Link href="/catalog">
            <Button className="bg-[#CD8567] hover:bg-[#B8714C] text-white">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-medium text-gray-800 mb-8">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image ? (
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    🌱
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600">Категория: {item.slug}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQty(item.id, Math.max(1, item.qty - 1))}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{item.qty}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQty(item.id, item.qty + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Remove Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => remove(item.id)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Итого</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Товаров:</span>
              <span className="font-medium">{items.reduce((sum, item) => sum + item.qty, 0)}</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <Button
              onClick={clear}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Очистить корзину
            </Button>
            
            <Link href="/checkout" className="block">
              <Button className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white">
                Оформить заказ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}