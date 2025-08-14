import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingCart, Heart } from "lucide-react";
import rosePeachImage from '@/app/assets/rose_peach_popular.jpg';
import roseWhiteImage from '@/app/assets/rose_white_popular.jpg';
import rosePopularImage from '@/app/assets/rose_popular.jpg';
import tulipPopularImage from '@/app/assets/tulip_popular.jpg';

const products = [
  {
    name: "Набор \"Персиковый сад\"",
    description: "15 луковиц персиковых роз",
    subtitle: "луковицы",
    image: rosePeachImage,
    isPopular: true
  },
  {
    name: "Рассада \"Нежность\"",
    description: "21 саженец белых роз",
    subtitle: "рассада",
    image: roseWhiteImage
  },
  {
    name: "Семена \"Весна\"",
    description: "Смесь семян тюльпанов",
    subtitle: "семена", 
    image: tulipPopularImage
  },
  {
    name: "Луковицы \"Роскошь\"",
    description: "25 луковиц красных роз",
    subtitle: "луковицы",
    image: rosePopularImage
  }
];

export function PopularProductsSection() {
  return (
    <section className="py-16 bg-[#FDF8F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-800 mb-4">
            Хиты продаж для посадки
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Самые популярные материалы наших клиентов
          </p>
          <p className="text-sm text-gray-500">
            семена, луковицы, рассада
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  wrapperClassName="h-64 w-full"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Quick action buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="secondary" className="p-2 bg-white/90 hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="p-2 bg-[#CD8567] hover:bg-[#B8714C]">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>

                {/* Popular badge */}
                {product.isPopular && (
                  <div className="absolute top-4 left-4 bg-[#CD8567] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Популярно
                  </div>
                )}
                
                {/* Product type badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 text-[#CD8567] px-2 py-1 rounded-full text-xs font-medium">
                  {product.subtitle}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6">{product.description}</p>

                <Button 
                  className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white"
                  size="sm"
                >
                  Узнать подробнее
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white px-8"
          >
            Смотреть все для посадки
          </Button>
        </div>
      </div>
    </section>
  );
}