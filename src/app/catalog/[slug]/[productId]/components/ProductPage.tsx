"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";

const productImages = [
  "https://images.unsplash.com/photo-1597848212624-e50d736d1dc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1551058503-5a62456d78b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606923599723-0b8df2dd8af6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
];

const productVariants = [
  { name: "White Aurora", color: "#FFFFFF", isSelected: true },
  { name: "Pink Aurora", color: "#FFB6C1", isSelected: false },
  { name: "Purple Aurora", color: "#DDA0DD", isSelected: false },
  { name: "Blue Aurora", color: "#ADD8E6", isSelected: false },
  { name: "Yellow Aurora", color: "#FFFFE0", isSelected: false },
  { name: "Peach Aurora", color: "#FFDAB9", isSelected: false },
];

const relatedProducts = [
  { name: "White Dream", image: "https://images.unsplash.com/photo-1597848212624-e50d736d1dc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { name: "Pink Elegance", image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { name: "Purple Majesty", image: "https://images.unsplash.com/photo-1551058503-5a62456d78b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
];

export function ProductPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  // на всякий случай — рендерим скелетон, если роут ещё не готов
  if (!slug || !productId) {
    return <div className="container mx-auto px-4 py-16 text-gray-500">Загрузка…</div>;
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const productTitle = "White Aurora";

  return (
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-[#CD8567] transition-colors">Home</Link>
            <span>›</span>
            <Link href={`/catalog/${slug}`} className="hover:text-[#CD8567] transition-colors">
              {String(slug)}
            </Link>
            <span>›</span>
            <span className="text-[#4A3A2B] font-medium">{productTitle}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <div className="w-full h-[600px] border-2 border-[#F5E4D2] rounded-2xl overflow-hidden bg-[#FDF8F5]">
                  <ImageWithFallback
                      src={productImages[currentImageIndex]}
                      alt={`${productTitle} Эустома`}
                      className="w-full h-full object-cover"
                      wrapperClassName="h-full w-full"
                      sizes="(min-width:1024px) 50vw, 100vw"
                  />
                  {/* Navigation Buttons */}
                  <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#CD8567]/70 hover:bg-[#CD8567]/90 text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#CD8567]/70 hover:bg-[#CD8567]/90 text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex space-x-3">
                {productImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                            currentImageIndex === index ? "border-[#CD8567] ring-2 ring-[#CD8567]/20" : "border-[#F5E4D2] hover:border-[#CD8567]/50"
                        }`}
                    >
                      <ImageWithFallback
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          wrapperClassName="h-full w-full"
                          sizes="80px"
                      />
                    </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-4xl font-serif text-[#4A3A2B] mb-2">{productTitle}</h1>
                <p className="text-lg text-gray-600">Эустома махровая белая</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#CD8567] fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(47 отзывов)</span>
                </div>
              </div>

              {/* Characteristics */}
              <div className="bg-[#FDF8F5] rounded-xl p-6">
                <h3 className="text-lg font-medium text-[#4A3A2B] mb-4">Характеристики</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 py-2 border-b border-[#F0E6DC]">
                    <span className="text-gray-600">Высота</span>
                    <span className="text-[#4A3A2B] font-medium">60-80 см</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-[#F0E6DC]">
                    <span className="text-gray-600">Цвет</span>
                    <span className="text-[#4A3A2B] font-medium">Белый</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-[#F0E6DC]">
                    <span className="text-gray-600">Период цветения</span>
                    <span className="text-[#4A3A2B] font-medium">Июль-Сентябрь</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600">Тип</span>
                    <span className="text-[#4A3A2B] font-medium">Семена</span>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div>
                <h3 className="text-lg font-medium text-[#4A3A2B] mb-4">Доступные варианты</h3>
                <div className="grid grid-cols-3 gap-3">
                  {productVariants.map((variant, index) => (
                      <button
                          key={index}
                          onClick={() => setSelectedVariant(index)}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                              selectedVariant === index ? "border-[#CD8567] bg-[#CD8567]/5" : "border-[#F5E4D2] hover:border-[#CD8567]/50"
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: variant.color }} />
                          <span className="text-sm font-medium text-[#4A3A2B]">{variant.name}</span>
                        </div>
                      </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#FDF8F5] rounded-xl p-6 space-y-4">
                <div className="text-center py-4">
                  <div className="mb-3">
                    <p className="text-lg font-medium text-[#4A3A2B] mb-2">Индивидуальная цена</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Наш менеджер свяжется с вами и обсудит цену с учетом объема заказа и ваших потребностей
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 bg-white border border-[#CD8567]/20 rounded-lg flex items-center justify-center hover:bg-[#CD8567]/5 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-[#CD8567]" />
                    </button>
                    <span className="w-8 text-center font-medium text-[#4A3A2B]">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 bg-white border border-[#CD8567]/20 rounded-lg flex items-center justify-center hover:bg-[#CD8567]/5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#CD8567]" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-[#CD8567] hover:bg-[#B8714C] text-white h-12 rounded-xl">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    В корзину
                  </Button>
                  <Button variant="outline" size="sm" className="w-12 h-12 border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white rounded-xl">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3 bg-[#FDF8F5] p-1 rounded-xl">
              <TabsTrigger value="description" className="rounded-lg">Описание</TabsTrigger>
              <TabsTrigger value="care" className="rounded-lg">Уход</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">Отзывы</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 bg-white rounded-xl p-6 border border-[#F5E4D2]">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Эустома White Aurora — это роскошный сорт с крупными махровыми цветками чистого белого цвета.
                  Идеально подходит для создания элегантных букетов и украшения садовых композиций.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Растение достигает высоты 60-80 см, цветет обильно с июля по сентябрь.
                  Цветки имеют нежную текстуру и долго сохраняют свежесть в срезке.
                </p>
                <p className="text-gray-700 leading-relaxed">Семена высокого качества с отличной всхожестью. В упаковке 50 семян.</p>
              </div>
            </TabsContent>

            <TabsContent value="care" className="mt-6 bg-white rounded-xl p-6 border border-[#F5E4D2]">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-medium text-[#4A3A2B] mb-4">Рекомендации по уходу</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><span className="w-2 h-2 bg-[#CD8567] rounded-full mt-2 mr-3 flex-shrink-0" /><span>Посев семян производить в феврале-марте в теплице или дома</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-[#CD8567] rounded-full mt-2 mr-3 flex-shrink-0" /><span>Температура прорастания: +20-22°C</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-[#CD8567] rounded-full mt-2 mr-3 flex-shrink-0" /><span>Пикировка в фазе 2-3 настоящих листьев</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-[#CD8567] rounded-full mt-2 mr-3 flex-shrink-0" /><span>Высадка в грунт после окончания заморозков</span></li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-[#CD8567] rounded-full mt-2 mr-3 flex-shrink-0" /><span>Предпочитает солнечные места с легкой полуденной тенью</span></li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 bg-white rounded-xl p-6 border border-[#F5E4D2]">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-[#4A3A2B]">Отзывы покупателей</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#CD8567] fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">4.9 из 5 (47 отзывов)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-[#F0E6DC] pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-[#CD8567] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">М</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-[#4A3A2B]">Мария К.</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-[#CD8567] fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                          Отличные семена! Всхожесть почти 100%. Цветы получились очень красивые, точно как на картинке. Обязательно закажу еще!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-[#F0E6DC] pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-[#CD8567] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">А</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-[#4A3A2B]">Анна С.</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-[#CD8567] fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                          Очень довольна покупкой. Эустомы зацвели рано и цвели до самых заморозков. Белые цветы просто великолепные!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related */}
          <div>
            <h2 className="text-2xl font-medium text-[#4A3A2B] mb-6">Похожие товары</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                  <div key={i} className="group cursor-pointer bg-[#FDF8F5] rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                      <ImageWithFallback
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          wrapperClassName="h-full w-full"
                          sizes="(min-width:768px) 33vw, 100vw"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-[#4A3A2B] group-hover:text-[#CD8567] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Эустома махровая</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}