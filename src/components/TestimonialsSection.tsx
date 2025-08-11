import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Анна",
    location: "г. Москва",
    text: "Заказывала луковицы роз для весенней посадки – доставили вовремя, качество отличное! Все луковицы проросли. Обслуживание на высшем уровне.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Михаил",
    location: "г. Санкт-Петербург", 
    text: "Отличные семена! Всхожесть превзошла все ожидания, жена была в восторге от результата. Обязательно буду заказывать ещё для следующего сезона.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Екатерина",
    location: "г. Казань",
    text: "Потрясающий сервис! Помогли выбрать идеальную рассаду для моего сада, доставка точно в срок. Спасибо за прекрасные растения!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#FDF2ED] to-[#F4E4D6]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-800 mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Читайте, что говорят о нас довольные садоводы
          </p>
          <p className="text-sm text-gray-500">
            семена, луковицы, рассада
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-[#CD8567] opacity-60" />
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-[#CD8567] fill-current"
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-medium text-[#CD8567] mb-2">500+</div>
              <p className="text-gray-600">Довольных садоводов</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-medium text-[#CD8567] mb-2">10 лет</div>
              <p className="text-gray-600">На рынке</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-medium text-[#CD8567] mb-2">98%</div>
              <p className="text-gray-600">Успешных посадок</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}