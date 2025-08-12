// src/app/cart/CartClient.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export default function CartClient() {
    const items = useCart((s) => s.items);
    const setQty = useCart((s) => s.setQty);
    const remove = useCart((s) => s.remove);
    const clear  = useCart((s) => s.clear);

    // Контакты (простая форма без бэка)
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");

    const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

    const submit = () => {
        // Здесь вместо отправки на сервер — просто лог.
        const payload = { contacts: { name, phone, email, comment }, items };
        console.log("ORDER (no prices):", payload);

        // Можешь заменить на fetch/route handler при появлении бэка
        alert("Заявка отправлена. Мы свяжемся с вами!");
        clear();
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-2xl font-medium mb-4">Корзина пуста</h1>
                <Link href="/catalog" className="text-[#CD8567] hover:underline">Перейти в каталог</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Содержимое корзины */}
            <div className="bg-white rounded-xl border border-[#CD8567]/10 p-4 sm:p-6">
                <h2 className="text-xl font-medium text-[#4A3A2B] mb-4">Ваши товары</h2>

                <div className="divide-y">
                    {items.map((i) => (
                        <div key={i.id} className="py-4 flex items-center gap-4">
                            <div className="shrink-0">
                                <ImageWithFallback
                                    src={i.image ?? "https://via.placeholder.com/80x80?text=No+Image"}
                                    alt={i.name}
                                    width={64}
                                    height={64}
                                    sizes="64px"
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/catalog/${i.slug}/${i.id}`}
                                    className="font-medium text-[#4A3A2B] hover:text-[#CD8567] transition-colors line-clamp-1"
                                >
                                    {i.name}
                                </Link>
                                <div className="text-sm text-gray-500">ID: {i.id}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5"
                                    onClick={() => setQty(i.id, i.qty - 1)}
                                    aria-label="Уменьшить"
                                >−</button>
                                <div className="w-10 text-center">{i.qty}</div>
                                <button
                                    className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5"
                                    onClick={() => setQty(i.id, i.qty + 1)}
                                    aria-label="Увеличить"
                                >+</button>
                            </div>

                            <Button variant="outline" className="ml-2" onClick={() => remove(i.id)}>
                                Удалить
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Контакты + Итог (только количество) */}
            <div className="bg-white rounded-xl border border-[#CD8567]/10 p-4 sm:p-6 h-fit">
                <h2 className="text-xl font-medium text-[#4A3A2B] mb-4">Контактная информация</h2>

                <div className="space-y-3">
                    <Input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <textarea
                        placeholder="Комментарий"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Всего товаров</span>
                        <span className="text-lg font-semibold">{totalCount}</span>
                    </div>

                    <Button
                        className="mt-4 w-full bg-[#CD8567] hover:bg-[#B8714C] text-white"
                        onClick={submit}
                    >
                        Отправить заявку
                    </Button>

                    <Button variant="outline" className="mt-2 w-full" onClick={clear}>
                        Очистить корзину
                    </Button>
                </div>
            </div>
        </div>
    );
}