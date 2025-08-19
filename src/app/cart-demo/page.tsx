"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Product, useCartDemo } from "./state";
import Link from "next/link";

const TEST_PRODUCTS: Product[] = [
  {
    id: "test-1",
    name: "Роза «Красная Королева»",
    image:
      "https://images.unsplash.com/photo-1597848212624-e50d736d1dc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Классическая красная роза с насыщенным ароматом",
  },
  {
    id: "test-2",
    name: "Тюльпан «Белоснежка»",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Элегантный белый тюльпан для весеннего сада",
  },
  {
    id: "test-3",
    name: "Хризантема «Золотая Осень»",
    image:
      "https://images.unsplash.com/photo-1551058503-5a62456d78b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Яркая осенняя хризантема с крупными цветками",
  },
  {
    id: "test-4",
    name: "Эустома «Нежная Роза»",
    image:
      "https://images.unsplash.com/photo-1606923599723-0b8df2dd8af6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Нежные розоподобные цветы для романтичного сада",
  },
];

function AnimatedRow({
  children,
  isRemoving,
}: {
  children: React.ReactNode;
  isRemoving?: boolean;
}) {
  const [appeared, setAppeared] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setAppeared(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={
        "transition-all duration-200 " +
        (appeared && !isRemoving
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2") +
        (isRemoving ? " opacity-0 translate-y-2" : "")
      }
    >
      {children}
    </div>
  );
}

function CartBadge({ count }: { count: number }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 220);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <span
      className={
        "inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#CD8567] px-2 text-white text-xs transition-transform " +
        (pulse ? "scale-110" : "scale-100")
      }
    >
      {count}
    </span>
  );
}

export default function Page() {
  const { items, add, setQty, remove, clear, totalCount, removingId } =
    useCartDemo();
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const onAdd = (p: Product) => {
    add(p, 1);
    setLastAdded(p.id);
    setTimeout(() => setLastAdded((id) => (id === p.id ? null : id)), 500);
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-medium text-gray-800">Локальная корзина (демо)</h1>
                <p className="text-gray-600">Без API, только локальный стейт и плавные анимации</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-700">В корзине</span>
                <CartBadge count={totalCount} />
                <Button variant="outline" onClick={clear} className="ml-2">
                  Очистить
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {TEST_PRODUCTS.map((p) => {
                const existing = items.find((i) => i.id === p.id);
                const qty = existing?.qty ?? 0;
                return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={p.image}
                      alt={p.name}
                      fill
                      wrapperClassName="h-full w-full"
                      className="transition-transform duration-300 group-hover:scale-105 object-cover"
                      sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    />
                    {lastAdded === p.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[#2F855A] shadow">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Добавлено</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{p.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description}</p>
                    {qty === 0 ? (
                      <Button onClick={() => onAdd(p)} className="w-full bg-[#CD8567] hover:bg-[#B8714C]">
                        В корзину
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <button
                          className="w-10 h-10 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 grid place-items-center"
                          onClick={() => setQty(p.id, qty - 1)}
                          aria-label="Уменьшить"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="min-w-10 text-center font-medium">{qty}</div>
                        <button
                          className="w-10 h-10 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 grid place-items-center"
                          onClick={() => setQty(p.id, qty + 1)}
                          aria-label="Увеличить"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );})}
            </div>

            <div className="bg-white rounded-2xl border border-[#CD8567]/10 shadow-sm p-5">
              <h2 className="text-xl font-medium text-[#4A3A2B] mb-4">Корзина</h2>
              {items.length === 0 ? (
                <p className="text-gray-500">Добавьте товары из списка выше.</p>
              ) : (
                <div className="divide-y">
                  {items.map((i) => (
                    <AnimatedRow key={i.id} isRemoving={removingId === i.id}>
                      <div className="py-3 flex items-center gap-3">
                        <div className="shrink-0">
                          <ImageWithFallback
                            src={i.image ?? "https://via.placeholder.com/48x48?text=No+Image"}
                            alt={i.name}
                            width={48}
                            height={48}
                            sizes="48px"
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#4A3A2B] line-clamp-1">{i.name}</div>
                          <div className="text-xs text-gray-500">ID: {i.id}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 grid place-items-center"
                            onClick={() => setQty(i.id, i.qty - 1)}
                            aria-label="Уменьшить"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="w-10 text-center">{i.qty}</div>
                          <button
                            className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 grid place-items-center"
                            onClick={() => setQty(i.id, i.qty + 1)}
                            aria-label="Увеличить"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          className="ml-1 text-red-600 hover:text-red-700 p-2"
                          onClick={() => remove(i.id)}
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </AnimatedRow>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <Link href="/cart-demo/checkout">
                <Button className="bg-[#CD8567] hover:bg-[#B8714C]">Перейти к оформлению</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


