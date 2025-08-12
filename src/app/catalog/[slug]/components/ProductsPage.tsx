"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  ChevronRight,
  Home,
} from "lucide-react";
import { useState } from "react";

// твои данные — без изменений
const products = [
  { id: 1, name: "Роза «Красная Королева»", type: "Луковицы", description: "Классическая красная роза с насыщенным ароматом", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "350 ₽", originalPrice: "450 ₽", isNew: false, isPopular: true, isSale: true, stock: "В наличии", rating: 4.8 },
  { id: 2, name: "Роза «Белоснежка»", type: "Рассада", description: "Элегантная белая роза для торжественных случаев", image: "https://images.unsplash.com/photo-1551058503-5a62456d78b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "420 ₽", originalPrice: null, isNew: true, isPopular: false, isSale: false, stock: "В наличии", rating: 4.9 },
  { id: 3, name: "Роза «Персиковый Закат»", type: "Семена", description: "Нежные персиковые оттенки для романтичного сада", image: "https://images.unsplash.com/photo-1606923599723-0b8df2dd8af6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "280 ₽", originalPrice: null, isNew: false, isPopular: true, isSale: false, stock: "В наличии", rating: 4.7 },
  { id: 4, name: "Роза «Розовая Мечта»", type: "Луковицы", description: "Нежно-розовая роза с долгим цветением", image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "390 ₽", originalPrice: "480 ₽", isNew: false, isPopular: false, isSale: true, stock: "Мало в наличии", rating: 4.6 },
  { id: 5, name: "Роза «Золотое Сияние»", type: "Рассада", description: "Уникальная желтая роза с золотистым отливом", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "520 ₽", originalPrice: null, isNew: true, isPopular: true, isSale: false, stock: "В наличии", rating: 5.0 },
  { id: 6, name: "Роза «Лиловый Туман»", type: "Семена", description: "Редкая фиолетовая роза с необычным окрасом", image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "650 ₽", originalPrice: null, isNew: true, isPopular: false, isSale: false, stock: "Под заказ", rating: 4.5 },
  { id: 7, name: "Роза «Малиновый Бархат»", type: "Луковицы", description: "Глубокий малиновый цвет с бархатистыми лепестками", image: "https://images.unsplash.com/photo-1518621012806-19718d6eeffe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "440 ₽", originalPrice: "520 ₽", isNew: false, isPopular: true, isSale: true, stock: "В наличии", rating: 4.8 },
  { id: 8, name: "Роза «Кремовая Нежность»", type: "Рассада", description: "Изысканная кремовая роза для утонченных натур", image: "https://images.unsplash.com/photo-1561181286-d52888359fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "380 ₽", originalPrice: null, isNew: false, isPopular: false, isSale: false, stock: "В наличии", rating: 4.7 },
  { id: 9, name: "Роза «Огненная Страсть»", type: "Семена", description: "Яркая оранжево-красная роза с интенсивным цветом", image: "https://images.unsplash.com/photo-1455690378663-615551044797?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", price: "320 ₽", originalPrice: "400 ₽", isNew: false, isPopular: false, isSale: true, stock: "В наличии", rating: 4.4 },
];

type PageProps = { params: { slug: string } };

export default function ProductsPage({ params }: PageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [filterType, setFilterType] = useState("all");

  const normalizePrice = (p: string) => Number(p.replace(/[^\d.]/g, "")) || 0;

  const filteredProducts = products.filter((product) => {
    if (filterType === "all") return true;
    return product.type.toLowerCase() === filterType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return normalizePrice(a.price) - normalizePrice(b.price);
      case "price-high":
        return normalizePrice(b.price) - normalizePrice(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return b.rating - a.rating;
      default:
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    }
  });

  const categoryTitle = "Розы"; // можешь вывести из params.slug при желании

  return (
      <div className="py-8 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Home className="w-4 h-4" />
            <span>Главная</span>
            <ChevronRight className="w-4 h-4" />
            <span>Категории</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#CD8567] font-medium">{categoryTitle}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-medium text-gray-800 mb-2">{categoryTitle}</h1>
                <p className="text-lg text-gray-600">
                  Изысканные розы для вашего сада • семена, луковицы, рассада
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-[#FDF8F5] rounded-2xl p-6 text-center">
                  <div className="text-2xl font-medium text-[#CD8567] mb-1">{products.length}</div>
                  <div className="text-sm text-gray-600">видов роз</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FDF8F5] to-[#F4E4D6] rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed">
                Откройте для себя мир прекрасных роз в садовом центре "Сады Рассвета". От классических красных до экзотических фиолетовых - у нас есть розы на любой вкус. Все растения проходят тщательный отбор и гарантируют высокую всхожесть.
              </p>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-[#FDF8F5] rounded-2xl">
            {/* ...всё как у тебя... */}
            {/* (блок фильтров и переключателей без изменений) */}
            {/* — опущено здесь ради краткости — */}
          </div>

          {/* Products Grid */}
          <div
              className={`grid gap-6 ${
                  viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
              }`}
          >
            {sortedProducts.map((product) => (
                <div
                    key={product.id}
                    className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        viewMode === "list" ? "flex" : ""
                    }`}
                >
                  {/* Image Container — кликабельно в товар */}
                  <div
                      className={`relative overflow-hidden ${
                          viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"
                      }`}
                  >
                    <Link href={`/catalog/${params.slug}/${product.id}`} className="absolute inset-0 z-10" aria-label={product.name} />
                    <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        wrapperClassName="h-full w-full"
                        sizes={
                          viewMode === "grid"
                              ? "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                              : "384px"
                        }
                    />
                    {/* ...твои бейджи/кнопки — без изменений... */}
                  </div>

                  {/* Content */}
                  <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                    {/* тип */}
                    <div className="mb-2">
                      <Badge variant="outline" className="text-[#CD8567] border-[#CD8567]/30 mb-2">
                        {product.type}
                      </Badge>
                    </div>

                    {/* Заголовок — тоже ссылка */}
                    <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-[#CD8567] transition-colors">
                      <Link href={`/catalog/${params.slug}/${product.id}`}>{product.name}</Link>
                    </h3>

                    {/* остальной контент карточки — как у тебя */}
                    {/* ...описание, рейтинг, цена, кнопка В корзину... */}
                  </div>
                </div>
            ))}
          </div>

          {/* Load More — без изменений */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white px-8">
              Показать еще
            </Button>
          </div>
        </div>
      </div>
  );
}