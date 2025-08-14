import { ImageWithFallback } from "./figma/ImageWithFallback";
import eustomaImage from '@/app/assets/eustoma.jpg';
import tulipsImage from '@/app/assets/tulip.jpg';
import chrysanthemumImage from '@/app/assets/chrysanthemum.jpg';
import orchideasImage from '@/app/assets/orchideas.jpg';

const categories = [
    {
        name: "Хризантемы",
        subtitle: "семена, луковицы, рассада",
        image: chrysanthemumImage,
        description: "Яркие осенние красавицы"
    },
    {
        name: "Тюльпаны",
        subtitle: "семена, луковицы, рассада",
        image: tulipsImage,
        description: "Весенняя нежность и красота"
    },
    {
        name: "Эустомы",
        subtitle: "семена, луковицы, рассада",
        image: eustomaImage,
        description: "Нежные розоподобные цветы"
    },
    {
        name: "Орхидеи",
        subtitle: "семена, луковицы, рассада",
        image: orchideasImage,
        description: "Экзотическая красота"
    }
];

export function CategoriesSection() {
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                        >
                            <div className="relative overflow-hidden rounded-2xl shadow-md">
                                <ImageWithFallback
                                    src={category.image}
                                    alt={category.name}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                    wrapperClassName="h-64 w-full"
                                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-[#CD8567]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                                    <p className="text-xs text-white/80 mb-2">{category.subtitle}</p>
                                    <p className="text-sm text-white/90">{category.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}