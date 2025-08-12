"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

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
  Home,
  ChevronRight,
  Grid,
  List,
  Filter as FilterIcon,
} from "lucide-react";

// ------------------ Demo data (как у тебя) ------------------
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

type PageProps = { params?: { slug?: string } };

type SortKey = "popular" | "price-low" | "price-high" | "name" | "rating";
type FilterType = "all" | "семена" | "луковицы" | "рассада";

// ------------------ helpers ------------------
function humanizeSlug(slug: string) {
  const map: Record<string, string> = {
    rozy: "Розы",
    tulipany: "Тюльпаны",
    eustomy: "Эустомы",
  };
  return map[slug] ?? (slug ? slug[0].toUpperCase() + slug.slice(1) : "Категория");
}
const normalizePrice = (p: string) => Number(p.replace(/[^\d.]/g, "")) || 0;

// ------------------ component ------------------
function ProductsPageInner({ params }: PageProps) {
  // Надёжно получаем slug: либо из props, либо из useParams()
  const routeParams = useParams<{ slug?: string }>();
  const slug =
      params?.slug ??
      (typeof routeParams?.slug === "string" ? routeParams.slug : undefined) ??
      "rozy";

  const categoryTitle = humanizeSlug(slug);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortKey>("popular");
  const [filterType, setFilterType] = useState<FilterType>("all");

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

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-medium text-gray-800 mb-2">
                  {categoryTitle}
                </h1>
                <p className="text-lg text-gray-600">
                  Изысканные {categoryTitle.toLowerCase()} для вашего сада • семена, луковицы, рассада
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-[#FDF8F5] rounded-2xl p-6 text-center">
                  <div className="text-2xl font-medium text-[#CD8567] mb-1">{products.length}</div>
                  <div className="text-sm text-gray-600">видов {categoryTitle.toLowerCase()}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FDF8F5] to-[#F4E4D6] rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed">
                Откройте для себя мир прекрасных {categoryTitle.toLowerCase()} в садовом центре
                &nbsp;«Сады Рассвета». От классических оттенков до редких сортов — у нас есть варианты на любой вкус.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-[#FDF8F5] rounded-2xl">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-4 h-4 text-[#CD8567]" />
                <span className="text-gray-700 font-medium">Фильтры:</span>
              </div>

              <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                <SelectTrigger className="w-[180px] border-[#CD8567]/20">
                  <SelectValue placeholder="Тип материала" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="семена">Семена</SelectItem>
                  <SelectItem value="луковицы">Луковицы</SelectItem>
                  <SelectItem value="рассада">Рассада</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger className="w-[200px] border-[#CD8567]/20">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">По популярности</SelectItem>
                  <SelectItem value="price-low">Сначала дешёвые</SelectItem>
                  <SelectItem value="price-high">Сначала дорогие</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-[#CD8567] hover:bg-[#B8714C]" : "border-[#CD8567]/20"}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-[#CD8567] hover:bg-[#B8714C]" : "border-[#CD8567]/20"}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Grid */}
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
                  {/* Image — кликабельно в товар */}
                  <div
                      className={`relative overflow-hidden ${
                          viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"
                      }`}
                  >
                    <Link
                        href={`/catalog/${slug}/${product.id}`}
                        className="absolute inset-0 z-10"
                        aria-label={product.name}
                    />
                    <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        fill
                        wrapperClassName="h-full w-full"
                        className="transition-transform duration-300 group-hover:scale-105 object-cover"
                        sizes={
                          viewMode === "grid"
                              ? "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                              : "384px"
                        }
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && <Badge className="bg-[#CD8567] text-white">NEW</Badge>}
                      {product.isPopular && <Badge className="bg-[#B8714C] text-white">ХИТ</Badge>}
                      {product.isSale && <Badge className="bg-red-500 text-white">СКИДКА</Badge>}
                    </div>

                    {/* Stock */}
                    <div className="absolute bottom-3 left-3">
                      <Badge
                          variant={product.stock === "В наличии" ? "default" : "secondary"}
                          className={
                            product.stock === "В наличии"
                                ? "bg-green-500 text-white"
                                : product.stock === "Мало в наличии"
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-500 text-white"
                          }
                      >
                        {product.stock}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="mb-2">
                      <Badge variant="outline" className="text-[#CD8567] border-[#CD8567]/30 mb-2">
                        {product.type}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-[#CD8567] transition-colors">
                      <Link href={`/catalog/${slug}/${product.id}`}>{product.name}</Link>
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${
                                    i < Math.floor(product.rating) ? "text-[#CD8567] fill-current" : "text-gray-300"
                                }`}
                                viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-semibold text-[#CD8567]">{product.price}</span>
                      {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>

                    {/* CTA (место для AddToCartButton, если подключишь state корзины) */}
                    <div className="mt-auto">
                      <Button className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white">
                        В корзину
                      </Button>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-12">
            <Button
                variant="outline"
                size="lg"
                className="border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white px-8"
            >
              Показать еще
            </Button>
          </div>
        </div>
      </div>
  );
}

// Экспорт: и default, и именованный — чтобы удобно было подключать
export default function ProductsPage(props: PageProps) {
  return <ProductsPageInner {...props} />;
}
export { ProductsPageInner as ProductsPage };