// src/app/cart/CartClient.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/store/cart";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";

export default function CartClient() {
    const items = useCart((s) => s.items);
    const setQty = useCart((s) => s.setQty);
    const remove = useCart((s) => s.remove);
    const clear = useCart((s) => s.clear);
    const [hasMounted, setHasMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Контакты (простая форма без бэка)
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

    const handleQuantityChange = (id: string, newQty: number) => {
        if (newQty <= 0) {
            // Анимация удаления
            const element = document.getElementById(`cart-item-${id}`);
            if (element) {
                element.style.transform = 'translateX(-100%)';
                element.style.opacity = '0';
                setTimeout(() => {
                    setQty(id, 0);
                }, 300);
            } else {
                setQty(id, 0);
            }
        } else {
            setQty(id, newQty);
        }
    };

    const handleRemove = (id: string) => {
        const element = document.getElementById(`cart-item-${id}`);
        if (element) {
            element.style.transform = 'translateX(-100%)';
            element.style.opacity = '0';
            setTimeout(() => {
                remove(id);
            }, 300);
        } else {
            remove(id);
        }
    };

    const handleClear = () => {
        const elements = document.querySelectorAll('[id^="cart-item-"]');
        elements.forEach((element, index) => {
            setTimeout(() => {
                (element as HTMLElement).style.transform = 'translateX(-100%)';
                (element as HTMLElement).style.opacity = '0';
            }, index * 100);
        });
        setTimeout(() => {
            clear();
        }, elements.length * 100 + 300);
    };

    const submit = async () => {
        if (!name.trim() || !phone.trim()) {
            alert("Пожалуйста, заполните имя и телефон");
            return;
        }

        setIsSubmitting(true);
        
        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const payload = { contacts: { name, phone, email, comment }, items };
        console.log("ORDER (no prices):", payload);

        setIsSubmitting(false);
        setShowSuccess(true);
        
        setTimeout(() => {
            clear();
            setShowSuccess(false);
            setName("");
            setPhone("");
            setEmail("");
            setComment("");
        }, 2000);
    };

    // Don't render cart content until mounted to prevent hydration mismatch
    if (!hasMounted) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CD8567]"></div>
                </div>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="max-w-md mx-auto text-center py-20">
                    <div className="mb-6">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-medium text-gray-800 mb-4">Заявка отправлена!</h2>
                    <p className="text-gray-600 mb-8">Мы свяжемся с вами в ближайшее время</p>
                    <Link href="/catalog">
                        <Button className="bg-[#CD8567] hover:bg-[#B8714C] text-white">
                            Вернуться в каталог
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="max-w-md mx-auto text-center py-20">
                    <div className="mb-6">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-medium text-gray-800 mb-4">Корзина пуста</h2>
                    <p className="text-gray-600 mb-8">Добавьте товары из каталога</p>
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
            {/* Header */}
            <div className="mb-8">
                <Link href="/catalog" className="inline-flex items-center text-[#CD8567] hover:text-[#B8714C] transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Вернуться в каталог
                </Link>
                <h1 className="text-3xl font-medium text-gray-800">Корзина</h1>
                <p className="text-gray-600 mt-2">{totalCount} товар{totalCount === 1 ? '' : totalCount < 5 ? 'а' : 'ов'}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                {/* Содержимое корзины */}
                <div className="bg-white rounded-xl border border-[#CD8567]/10 p-6">
                    <h2 className="text-xl font-medium text-[#4A3A2B] mb-6">Ваши товары</h2>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                id={`cart-item-${item.id}`}
                                className="group bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
                                style={{ transform: 'translateX(0)', opacity: 1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0">
                                        <ImageWithFallback
                                            src={item.image ?? "https://via.placeholder.com/80x80?text=No+Image"}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            sizes="80px"
                                            className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/catalog/${item.slug}/${item.id}`}
                                            className="font-medium text-[#4A3A2B] hover:text-[#CD8567] transition-colors line-clamp-1 block"
                                        >
                                            {item.name}
                                        </Link>
                                        <div className="text-sm text-gray-500 mt-1">ID: {item.id}</div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <button
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                                                aria-label="Уменьшить"
                                            >
                                                <Minus className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <div className="w-12 text-center font-medium text-gray-800">
                                                {item.qty}
                                            </div>
                                            <button
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                                                aria-label="Увеличить"
                                            >
                                                <Plus className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            onClick={() => handleRemove(item.id)}
                                            aria-label="Удалить"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Clear Cart Button */}
                    {items.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <Button
                                variant="outline"
                                onClick={handleClear}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Очистить корзину
                            </Button>
                        </div>
                    )}
                </div>

                {/* Контакты + Итог */}
                <div className="bg-white rounded-xl border border-[#CD8567]/10 p-6 h-fit sticky top-4">
                    <h2 className="text-xl font-medium text-[#4A3A2B] mb-6">Контактная информация</h2>

                    <div className="space-y-4">
                        <Input 
                            placeholder="Ваше имя *" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-[#CD8567]/20"
                        />
                        <Input 
                            placeholder="Телефон *" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-[#CD8567]/20"
                        />
                        <Input 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-[#CD8567]/20"
                        />
                        <textarea
                            placeholder="Комментарий к заказу"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none transition-all duration-200 focus:ring-2 focus:ring-[#CD8567]/20"
                        />
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600">Всего товаров</span>
                            <span className="text-lg font-semibold text-[#4A3A2B]">{totalCount}</span>
                        </div>

                        <Button
                            className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white transition-all duration-200 transform hover:scale-[1.02]"
                            onClick={submit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Отправка...
                                </>
                            ) : (
                                'Отправить заявку'
                            )}
                        </Button>

                        <p className="text-xs text-gray-500 mt-3 text-center">
                            * Обязательные поля
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}