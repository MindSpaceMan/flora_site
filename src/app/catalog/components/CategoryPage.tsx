import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const categories = [
  {
    name: "Розы",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    isNew: true
  },
  {
    name: "Тюльпаны", 
    image: "https://images.unsplash.com/photo-1523936644037-d45d5c2bb8b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    isNew: false
  },
  {
    name: "Лилии",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    isNew: true
  },
  {
    name: "Орхидеи",
    image: "https://images.unsplash.com/photo-1569060692049-ad9b41895cb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    isNew: false
  },
  {
    name: "Гвоздики",
    image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    isNew: true
  },
  {
    name: "Хризантемы",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    isNew: false
  }
];

export function CategoryPage() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">
            Категории для посадки
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Выберите идеальные материалы для вашего сада
          </p>
          <p className="text-sm text-gray-500">
            семена, луковицы, рассада
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Card Container */}
              <div className="relative w-40 h-40 mb-4">
                {/* Card Background */}
                <div className="w-full h-full bg-[#FDF8F5] rounded-2xl border border-[#CD8567]/10 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                  {/* Image Container */}
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <ImageWithFallback
                        src={category.image}
                        alt={category.name}
                        className="w-28 h-28 object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
                        wrapperClassName="h-64 w-full"
                        sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
                    />
                  </div>
                  
                  {/* NEW Label */}
                  {category.isNew && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-[#CD8567] text-white px-2 py-1 rounded-md text-xs font-medium">
                        NEW
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Name */}
              <h3 className="text-xl font-semibold text-[#4A3A2B] text-center transition-colors duration-300 group-hover:text-[#CD8567]">
                {category.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center bg-[#FDF8F5] rounded-2xl p-8">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Качественные материалы для каждого сада
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            В нашем садовом центре "Сады Рассвета" вы найдете только проверенные временем сорта и качественный посадочный материал. 
            Каждая категория представлена широким ассортиментом семян, луковиц и рассады.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-medium text-[#CD8567] mb-2">500+</div>
              <p className="text-gray-600">Видов растений</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-[#CD8567] mb-2">98%</div>
              <p className="text-gray-600">Всхожесть семян</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-[#CD8567] mb-2">10 лет</div>
              <p className="text-gray-600">Опыта работы</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}