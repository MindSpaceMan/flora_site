"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
import AddToCartButton from "@/app/components/AddToCartButton";
import { getCategories, getCategoryWithProducts, type CategoryWithProducts, type Category } from "@/lib/api";

import {
  Home,
  ChevronRight,
  Grid,
  List,
  Filter as FilterIcon,
} from "lucide-react";

// Данные из API
type UiProduct = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  type?: string;
  heightCm?: number;
  latinName?: string;
};

type PageProps = { params?: { slug?: string } };

type SortKey = "name" | "height" | "type";
type FilterType = "all" | "tulipany" | "eustomy" | "hrizantemy" | "orkhidei";

// ------------------ helpers ------------------
function humanizeSlug(slug: string) {
  const map: Record<string, string> = {
    tyulpany: "Тюльпаны",
    eustomy: "Эустомы",
    hrizantemy: "Хризантемы",
    orkhidei: "Орхидеи",
  };
  return map[slug] ?? (slug ? slug[0].toUpperCase() + slug.slice(1) : "Категория");
}

function primaryImageUrl(p?: { images?: { url: string | null; localPath: string | null; isPrimary: boolean }[] }) {
  const list = p?.images ?? [];
  const primary = list.find((i) => i.isPrimary) ?? list[0];
  return primary?.url || primary?.localPath || undefined;
}

// ------------------ component ------------------
function ProductsPageInner({ params }: PageProps) {
  // Надёжно получаем slug: либо из props, либо из useParams()
  const routeParams = useParams<{ slug?: string }>();
  const slug =
      params?.slug ??
      (typeof routeParams?.slug === "string" ? routeParams.slug : undefined) ??
      "tyulpany";

  const router = useRouter();
  const categoryTitle = humanizeSlug(slug);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<CategoryWithProducts | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const cats = await getCategories();
        setCategories(cats);
        const found = cats.find((c) => c.slug === slug);
        if (!found) {
          setCategoryData({ id: "", name: categoryTitle, slug: slug!, products: [] });
          return;
        }
        const data = await getCategoryWithProducts(found.id);
        if (!cancelled) setCategoryData(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [displayCount, setDisplayCount] = useState(50);

  const uiProducts: UiProduct[] = useMemo(() => {
    const list = categoryData?.products ?? [];
    return list.map((p) => ({
      id: p.id,
      name: p.titleRu,
      description: p.description,
      image: primaryImageUrl(p),
      type: p.category?.name,
      heightCm: p.heightCm,
      latinName: p.latinName,
    }));
  }, [categoryData]);

  const filteredProducts = uiProducts.filter((product) => {
    if (filterType === "all") return true;
    return product.type?.toLowerCase() === filterType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "height":
        return (b.heightCm || 0) - (a.heightCm || 0);
      case "type":
        return (a.latinName || "").localeCompare(b.latinName || "");
      default:
        return 0;
    }
  });

  const displayedProducts = sortedProducts.slice(0, displayCount);
  const hasMoreProducts = displayCount < sortedProducts.length;

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 50, sortedProducts.length));
  };

  const handleCategoryFilter = (categorySlug: string) => {
    // Navigate to selected category page per requirements
    if (categorySlug && categorySlug !== slug) {
      router.push(`/catalog/${categorySlug}`);
      return;
    }
  };

  if (loading) {
    return (
      <div className="py-8 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-lg text-gray-600">Загрузка категории...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="py-8 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="flex items-center space-x-2 hover:text-[#CD8567] transition-colors">
              <Home className="w-4 h-4" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/catalog" className="hover:text-[#CD8567] transition-colors">
              Категории
            </Link>
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
                  <div className="text-2xl font-medium text-[#CD8567] mb-1">{uiProducts.length}</div>
                  <div className="text-sm text-gray-600">видов {categoryTitle.toLowerCase()}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FDF8F5] to-[#F4E4D6] rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed">
                Откройте для себя мир прекрасных {categoryTitle.toLowerCase()} в садовом центре
                &nbsp;«Флора Микс». От классических оттенков до редких сортов — у нас есть варианты на любой вкус.
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

              <Select value={slug} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="w-[220px] border-[#CD8567]/20">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger className="w-[200px] border-[#CD8567]/20">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">По названию</SelectItem>
                  <SelectItem value="height">По высоте</SelectItem>
                  <SelectItem value="type">По латинскому названию</SelectItem>
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
            {displayedProducts.map((product) => (
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
                        src={product.image || "https://via.placeholder.com/600x600?text=No+Image"}
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

                    {/* Type badge */}
                    {product.type && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#CD8567] text-white">
                          {product.type}
                        </Badge>
                      </div>
                    )}

                    {/* Height badge */}
                    {product.heightCm && (
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {product.heightCm} см
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                    <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-[#CD8567] transition-colors">
                      <Link href={`/catalog/${slug}/${product.id}`}>{product.name}</Link>
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* CTA */}
                    <div className="mt-auto space-y-2">
                      <Link href={`/catalog/${slug}/${product.id}`}>
                        <Button className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white">
                          Смотреть товар
                        </Button>
                      </Link>
                      <AddToCartButton
                        id={product.id}
                        slug={slug!}
                        name={product.name}
                        image={product.image}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Load more */}
          {hasMoreProducts && (
            <div className="text-center mt-12">
              <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  className="border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white px-8"
              >
                Показать еще ({sortedProducts.length - displayCount} из {sortedProducts.length})
              </Button>
            </div>
          )}
        </div>
      </div>
  );
}

// Экспорт: и default, и именованный — чтобы удобно было подключать
export default function ProductsPage(props: PageProps) {
  return <ProductsPageInner {...props} />;
}
export { ProductsPageInner as ProductsPage };