"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import AddToCartButton from "@/app/components/AddToCartButton";
import { getProduct, type Product } from "@/lib/api";

import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ChevronLeft, ChevronRight, Star, Heart, Minus, Plus } from "lucide-react";

export default function Page() {
  const params = useParams<{ slug?: string; productId?: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : undefined;
  const productId = typeof params?.productId === "string" ? params.productId : undefined;

  // если роут ещё не прогрузился
  if (!slug || !productId) {
    return (
        <div className="min-h-screen bg-white">
          <main>
            <div className="container mx-auto px-4 py-16 text-gray-500">Загрузка…</div>
          </main>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-white">
        <main>
          <ProductPage slug={slug} productId={productId} />
        </main>
      </div>
  );
}

function ProductPage({
  slug,
  productId,
}: {
  slug: string;
  productId: string;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await getProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-lg text-gray-600">Загрузка товара...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-lg text-gray-600">Товар не найден</div>
          </div>
        </div>
      </div>
    );
  }

  const productImages = product.images || [];
  const hasImages = productImages.length > 0;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  return (
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-[#CD8567] transition-colors">Home</Link>
            <span>›</span>
            <Link href={`/catalog/${slug}`} className="hover:text-[#CD8567] transition-colors">
              {product.category?.name || slug}
            </Link>
            <span>›</span>
            <span className="text-[#4A3A2B] font-medium">{product.titleRu}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <div className="relative w-full h-[600px] border-2 border-[#F5E4D2] rounded-2xl overflow-hidden bg-[#FDF8F5]">
                  {hasImages ? (
                    <ImageWithFallback
                        src={productImages[currentImageIndex]?.url || productImages[currentImageIndex]?.localPath || ""}
                        alt={productImages[currentImageIndex]?.alt || product.titleRu}
                        fill
                        className="object-cover"
                        sizes="(min-width:1024px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🌱</div>
                        <div>Изображение отсутствует</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Buttons - only show if multiple images */}
                  {productImages.length > 1 && (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnails - only show if multiple images */}
              {productImages.length > 1 && (
                <div className="flex space-x-3">
                  {productImages.map((image, index) => (
                      <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                              currentImageIndex === index
                                  ? "border-[#CD8567] ring-2 ring-[#CD8567]/20"
                                  : "border-[#F5E4D2] hover:border-[#CD8567]/50"
                          }`}
                      >
                        <ImageWithFallback
                            src={image.url || image.localPath || ""}
                            alt={image.alt || `Изображение ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover"
                            sizes="80px"
                        />
                      </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-4xl font-serif text-[#4A3A2B] mb-2">{product.titleRu}</h1>
                {product.latinName && (
                  <p className="text-lg text-gray-600 italic">{product.latinName}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#CD8567] fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(Отзывы)</span>
                </div>
              </div>

              {/* Characteristics */}
              <div className="bg-[#FDF8F5] rounded-xl p-6">
                <h3 className="text-lg font-medium text-[#4A3A2B] mb-4">Характеристики</h3>
                <div className="space-y-3">
                  {product.heightCm && (
                    <div className="grid grid-cols-2 py-2 border-b border-[#F0E6DC]">
                      <span className="text-gray-600">Высота</span>
                      <span className="text-[#4A3A2B] font-medium">{product.heightCm} см</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="grid grid-cols-2 py-2 border-b border-[#F0E6DC]">
                      <span className="text-gray-600">Категория</span>
                      <span className="text-[#4A3A2B] font-medium">{product.category.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-medium text-[#4A3A2B] mb-3">Описание</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Количество:</span>
                  <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 flex items-center justify-center"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AddToCartButton
                    id={product.id}
                    slug={slug}
                    name={product.titleRu}
                    image={productImages[0]?.url || productImages[0]?.localPath || undefined}
                    qty={quantity}
                    className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white py-3 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="care">Уход</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="bg-[#FDF8F5] rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "Подробное описание товара будет добавлено позже."}
                </p>
              </div>
            </TabsContent>
                         <TabsContent value="care" className="mt-6">
               <div className="bg-[#FDF8F5] rounded-xl p-6">
                 {product.careMessage ? (
                   <div className="prose prose-lg max-w-none">
                     <h3 className="text-xl font-medium text-[#4A3A2B] mb-4">Рекомендации по уходу</h3>
                     <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                       {product.careMessage}
                     </div>
                   </div>
                 ) : (
                   <p className="text-gray-700 leading-relaxed">
                     Информация по уходу за растением будет добавлена позже.
                   </p>
                 )}
               </div>
             </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}