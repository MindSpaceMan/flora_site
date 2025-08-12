"use client"

import { Menu, X, ShoppingCart, Phone } from 'lucide-react';
import { Button } from "./ui/button";
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#CD8567]/10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-medium text-[#CD8567]">АуроФлора</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#catalog" 
              className="text-[#CD8567] transition-colors"
            >
              Каталог
            </a>
            <a href="#delivery" className="text-gray-700 hover:text-[#CD8567] transition-colors">
              Доставка
            </a>
            <a href="#about" className="text-gray-700 hover:text-[#CD8567] transition-colors">
              О нас
            </a>
            <a href="#contacts" className="text-gray-700 hover:text-[#CD8567] transition-colors">
              Контакты
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <a href="tel:+74951234567" className="hidden md:flex items-center space-x-2 text-[#CD8567] hover:text-[#B8714C] transition-colors">
              <Phone className="w-4 h-4" />
              <span>+7 (495) 123-45-67</span>
            </a>
            <Button variant="outline" size="sm" className="border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Корзина
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <a 
                href="#catalog" 
                className="text-[#CD8567] transition-colors inline-block"
              >
                Каталог
              </a>
              <a href="#delivery" className="text-gray-700 hover:text-[#CD8567] transition-colors">
                Доставка
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#CD8567] transition-colors">
                О нас
              </a>
              <a href="#contacts" className="text-gray-700 hover:text-[#CD8567] transition-colors">
                Контакты
              </a>
              <a href="tel:+74951234567" className="flex items-center space-x-2 text-[#CD8567] hover:text-[#B8714C] transition-colors">
                <Phone className="w-4 h-4" />
                <span>+7 (495) 123-45-67</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}