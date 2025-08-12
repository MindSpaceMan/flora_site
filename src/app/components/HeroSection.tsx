import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Семена и рассада для посадки"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
          Доставка лучших материалов<br />
          для посадки в ваш регион
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-2 max-w-2xl mx-auto">
          Качественные семена, луковицы, рассада с любовью и заботой
        </p>
        
        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
          семена, луковицы, рассада
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-[#CD8567] hover:bg-[#B8714C] text-white px-8 py-3 text-lg"
          >
            Выбрать для посадки
          </Button>
          <Button 
            size="lg"
            className="text-[#CD8567] bg-white/90 hover:bg-white transition-colors duration-200 px-8 py-3 text-lg border-0"
          >
            Каталог
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
}