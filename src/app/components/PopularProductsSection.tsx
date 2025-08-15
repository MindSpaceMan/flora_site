import {Button} from "./ui/button";
import Link from "next/link";
import {ImageWithFallback} from "./figma/ImageWithFallback";
import {ShoppingCart, Heart} from "lucide-react";
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
                            className="h-full flex flex-col rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg">
                            {/* Картинка фиксированной высоты */}
                            <div className="relative h-72 w-full">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover"
                                    wrapperClassName="absolute inset-0"   // чтобы fill занял контейнер
                                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                                />
                                {/* бейджи, иконки — как было */}
                            </div>

                            {/* Контент растягиваем по высоте */}
                            <div className="flex flex-1 flex-col p-6">
                                {/* подзаголовок/бейдж */}
                                <span
                                    className="mb-2 inline-block rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
      {product.subtitle}
    </span>

                                {/* заголовок */}
                                <h3 className="text-xl font-semibold text-neutral-900">{product.name}</h3>

                                {/* описание (опционально) */}
                                {product.description && (
                                    <p className="mt-2 text-neutral-600">{product.description}</p>
                                )}

                                {/* Кнопка «прибита» к низу карточки */}
                                <div className="mt-auto pt-6">
                                    <Button className="w-full bg-[#CD8567] hover:bg-[#B8714C]">
                                        Узнать подробнее
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/catalog" className="w-full">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white px-8"
                        >
                            Смотреть все для посадки
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}