import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/lib/api";

export function CategoriesSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                if (!cancelled) setCategories(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-800 mb-4">
                        Популярные категории для посадки
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
                        Выберите идеальные материалы для любого сада
                    </p>
                    <p className="text-sm text-gray-500">
                        семена, луковицы, рассада
                    </p>
                </div>
                {loading ? (
                    <div className="text-center text-gray-600 py-12">Загрузка категорий…</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/catalog/${category.slug}`}
                                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 block"
                            >
                                <div className="relative overflow-hidden rounded-2xl shadow-md">
                                    {category.imagePath ? (
                                        <div className="h-64 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundImage: `url(http://localhost:8337${category.imagePath})` }} />
                                    ) : (
                                        <div className="h-64 w-full bg-gradient-to-br from-[#FDF8F5] to-[#F4E4D6] flex items-center justify-center">
                                            <div className="text-6xl text-[#CD8567] opacity-60">{category.name.charAt(0)}</div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                                        <p className="text-xs text-white/80 mb-2">семена, луковицы, рассада</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}