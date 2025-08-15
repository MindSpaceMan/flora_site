import { Truck, Shield, Clock, MapPin, Thermometer, Package, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FDF8F5] via-white to-[#F4E4D6] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-6 leading-tight">
                  Доставка по РФ с соблюдением температурного режима
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Мы отправляем посадочный материал по всей России через надёжные транспортные компании. Для сохранности качества соблюдаем температурный режим на всех этапах.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-[#CD8567]">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Безопасная доставка</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-[#CD8567]">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Быстрая отправка</span>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/delivery.png"
                    alt="Доставка растений и семян"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#CD8567]/10 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#CD8567]/10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-lg text-gray-700 leading-relaxed">
              Для сохранности качества соблюдаем температурный режим на всех этапах — от сборки до вручения.
            </p>
          </div>

          {/* How we protect your order */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-gray-800 text-center mb-12">
              Как мы бережём ваш заказ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-[#FDF8F5] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#CD8567] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Термоупаковка</h3>
                <p className="text-gray-600">
                  Изотермические пакеты, утепляющие вкладыши и холодоэлементы в жару; дополнительное утепление зимой.
                </p>
              </div>

              <div className="bg-[#FDF8F5] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#CD8567] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Быстрая логистика</h3>
                <p className="text-gray-600">
                  Подбираем оптимальный маршрут и срок, чтобы посылка шла как можно меньше времени в пути.
                </p>
              </div>

              <div className="bg-[#FDF8F5] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#CD8567] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Аккуратная маркировка</h3>
                <p className="text-gray-600">
                  «Хрупко» и «Температурный контроль» — для бережной обработки на сортировках.
                </p>
              </div>

              <div className="bg-[#FDF8F5] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#CD8567] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Контроль и оповещения</h3>
                <p className="text-gray-600">
                  Трек-номер, уведомления о движении, помощь с перенаправлением на ПВЗ/курьера.
                </p>
              </div>

              <div className="bg-[#FDF8F5] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#CD8567] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Передача и получение</h3>
                <p className="text-gray-600">
                  Доставка курьером до двери или в пункт выдачи (на ваш выбор).
                </p>
              </div>

              <div className="bg-[#FDF8F5] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#CD8567] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Рекомендации</h3>
                <p className="text-gray-600">
                  Рекомендуем осмотреть посылку при получении; при внешних повреждениях — составить акт и сразу сообщить нам.
                </p>
              </div>
            </div>
          </div>

          {/* Important notice */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-[#F4E4D6] to-[#CD8567] rounded-2xl p-8 text-center">
              <p className="text-lg text-white font-medium">
                Мы поможем оформить претензию в ТК при необходимости
              </p>
            </div>
          </div>

          {/* Seasonal flexibility */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-gray-800 text-center mb-8">
              Гибкость по сезону
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-[#CD8567]/20 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <Thermometer className="w-6 h-6 text-[#CD8567] mr-3" />
                  <h3 className="text-xl font-medium text-gray-800">Отложенная отправка</h3>
                </div>
                <p className="text-gray-600">
                  По запросу можем отложить отправку до более подходящих погодных условий.
                </p>
              </div>

              <div className="bg-white border border-[#CD8567]/20 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-[#CD8567] mr-3" />
                  <h3 className="text-xl font-medium text-gray-800">Удалённые регионы</h3>
                </div>
                <p className="text-gray-600">
                  Для удалённых и северных регионов подбираем усиленную термозащиту и согласуем график.
                </p>
              </div>
            </div>
          </div>

          {/* Final message */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-[#FDF8F5] rounded-2xl p-8">
              <h2 className="text-2xl font-medium text-gray-800 mb-4">
                Наша цель
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Чтобы растения приехали к вам свежими и готовыми к посадке.
              </p>
              <p className="text-gray-600">
                Остались вопросы? <Link href="/#contacts" className="text-[#CD8567] hover:text-[#B8714C] transition-colors underline">Напишите</Link> нам — подберём лучший способ доставки именно для вашего заказа.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
