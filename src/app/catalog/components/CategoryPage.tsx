import Link from "next/link";
import { categories } from "@/data/categories";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"; // проверь путь

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
            <p className="text-sm text-gray-500">семена, луковицы, рассада</p>
          </div>

          {/* ТВОЯ сетка карточек + ссылки на /catalog/[slug] */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((c) => (
                <Link
                    key={c.slug}
                    href={`/catalog/${c.slug}`}
                    className="group cursor-pointer flex flex-col items-center"
                >
                  <div className="relative w-40 h-40 mb-4">
                    <div className="w-full h-full bg-[#FDF8F5] rounded-2xl border border-[#CD8567]/10 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      <div className="w-full h-full p-4 flex items-center justify-center">
                        <ImageWithFallback
                            src={c.image}
                            alt={c.name}
                            className="rounded-xl transition-transform duration-300 group-hover:scale-110"
                            wrapperClassName="w-28 h-28"
                            sizes="112px"
                        />
                      </div>
                      {c.isNew && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-[#CD8567] text-white px-2 py-1 rounded-md text-xs font-medium">
                              NEW
                            </div>
                          </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#4A3A2B] text-center transition-colors duration-300 group-hover:text-[#CD8567]">
                    {c.name}
                  </h3>
                </Link>
            ))}
          </div>

          {/* нижний блок — как у тебя */}
          <div className="mt-16 text-center bg-[#FDF8F5] rounded-2xl p-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">
              Качественные материалы для каждого сада
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              В нашем садовом центре «Флора Микс» вы найдете только проверенные
              временем сорта и качественный посадочный материал. Каждая категория
              представлена широким ассортиментом семян, луковиц и рассады.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Stat num="500+" label="Видов растений" />
              <Stat num="98%" label="Всхожесть семян" />
              <Stat num="10 лет" label="Опыта работы" />
            </div>
          </div>
        </div>
      </section>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
      <div className="text-center">
        <div className="text-2xl font-medium text-[#CD8567] mb-2">{num}</div>
        <p className="text-gray-600">{label}</p>
      </div>
  );
}