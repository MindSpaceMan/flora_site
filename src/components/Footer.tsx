import { Phone, Mail, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#8B4513] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-medium mb-4 text-[#FFBFA0]">АуроФлора</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              Доставляем качественные семена, луковицы и рассаду с любовью и заботой по всей Москве уже более 10 лет.
            </p>
            <div className="flex items-center text-white/60">
              <Heart className="w-4 h-4 mr-2 text-[#FFBFA0]" />
              <span>Сделано с любовью</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-[#FFBFA0]">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <a href="#catalog" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  Каталог
                </a>
              </li>
              <li>
                <a href="#delivery" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  Доставка
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#contacts" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-[#FFBFA0]">Категории для посадки</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  Хризантемы
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  Тюльпаны
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  Эустомы
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#FFBFA0] transition-colors">
                  Орхидеи
                </a>
              </li>
            </ul>
            <p className="text-xs text-white/60 mt-2">семена, луковицы, рассада</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-[#FFBFA0]">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-[#FFBFA0]" />
                <a 
                  href="tel:+74951234567" 
                  className="text-white/80 hover:text-[#FFBFA0] transition-colors"
                >
                  +7 (495) 123-45-67
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-[#FFBFA0]" />
                <a 
                  href="mailto:info@auroflora.ru" 
                  className="text-white/80 hover:text-[#FFBFA0] transition-colors"
                >
                  info@auroflora.ru
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-[#FFBFA0] mt-0.5" />
                <span className="text-white/80">
                  Москва, ул. Садовая, 15
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 mb-4 md:mb-0">
              © 2024 АуроФлора. Все права защищены.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/60 hover:text-[#FFBFA0] transition-colors text-sm">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-white/60 hover:text-[#FFBFA0] transition-colors text-sm">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}