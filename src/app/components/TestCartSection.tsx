// src/app/components/TestCartSection.tsx
"use client";

import AddToCartButton from "./AddToCartButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { useCart } from "@/store/cart";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Тестовые продукты
const testProducts = [
    {
        id: "test-1",
        slug: "rozy",
        name: "Роза «Красная Королева»",
        image: "https://images.unsplash.com/photo-1597848212624-e50d736d1dc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Классическая красная роза с насыщенным ароматом"
    },
    {
        id: "test-2",
        slug: "tyulpany",
        name: "Тюльпан «Белоснежка»",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Элегантный белый тюльпан для весеннего сада"
    },
    {
        id: "test-3",
        slug: "hrizantemy",
        name: "Хризантема «Золотая Осень»",
        image: "https://images.unsplash.com/photo-1551058503-5a62456d78b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Яркая осенняя хризантема с крупными цветками"
    },
    {
        id: "test-4",
        slug: "eustomy",
        name: "Эустома «Нежная Роза»",
        image: "https://images.unsplash.com/photo-1606923599723-0b8df2dd8af6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Нежные розоподобные цветы для романтичного сада"
    }
];

export function TestCartSection() {
    const items = useCart((s) => s.items);
    const clear = useCart((s) => s.clear);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <section className="py-16 bg-gradient-to-br from-[#FDF8F5] to-[#F4E4D6]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-800 mb-4">
                        Тестирование корзины
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
                        Попробуйте добавить товары в корзину и протестировать анимации
                    </p>
                    <p className="text-sm text-gray-500">
                        Текущее количество товаров в корзине: {hasMounted ? items.reduce((sum, i) => sum + i.qty, 0) : 0}
                    </p>
                </div>

                {/* Тестовые продукты */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {testProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    wrapperClassName="h-full w-full"
                                    className="transition-transform duration-300 group-hover:scale-105 object-cover"
                                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                                
                                {/* Add to cart button */}
                                <AddToCartButton
                                    id={product.id}
                                    slug={product.slug}
                                    name={product.name}
                                    image={product.image}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Текущая корзина */}
                {hasMounted && items.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-medium text-gray-800">
                                Текущая корзина ({hasMounted ? items.reduce((sum, i) => sum + i.qty, 0) : 0} товаров)
                            </h3>
                            <Button
                                variant="outline"
                                onClick={clear}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Очистить
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <ImageWithFallback
                                        src={item.image ?? "https://via.placeholder.com/40x40"}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        sizes="40px"
                                        className="rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                            {item.name}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            Количество: {item.qty}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600 mb-4">
                                Перейдите в корзину для полного управления заказом
                            </p>
                            <Button className="bg-[#CD8567] hover:bg-[#B8714C] text-white">
                                Перейти в корзину
                            </Button>
                        </div>
                    </div>
                )}

                {/* Инструкции */}
                <div className="mt-12 bg-white rounded-2xl p-6 shadow-md">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Как тестировать:</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li>• Нажмите "В корзину" на любом товаре - увидите анимацию добавления</li>
                        <li>• Проверьте счетчик в хедере - он должен анимироваться</li>
                        <li>• Перейдите в корзину для полного управления товарами</li>
                        <li>• Попробуйте изменить количество и удалить товары</li>
                        <li>• Заполните форму и отправьте заявку</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
