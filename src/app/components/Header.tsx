"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import HeaderCart from "./HeaderCart";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
      
      const handleHashChange = () => {
        setCurrentHash(window.location.hash);
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const isActive = (href: string) => {
    if (href === "/#contacts") {
      return pathname === "/" && (hasMounted ? currentHash === "#contacts" : false);
    }
    return pathname === href;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#CD8567] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ф</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Флора Микс</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            <Link href="/" className={isActive("/") ? "text-[#CD8567] font-medium" : "text-gray-700 hover:text-[#CD8567] transition-colors"}>
              Главная
            </Link>
            <Link href="/catalog" className={isActive("/catalog") ? "text-[#CD8567] font-medium" : "text-gray-700 hover:text-[#CD8567] transition-colors"}>
              Каталог
            </Link>
            <Link href="/delivery" className={isActive("/delivery") ? "text-[#CD8567] font-medium" : "text-gray-700 hover:text-[#CD8567] transition-colors"}>
              Доставка
            </Link>
            <Link href="/checkout" className={isActive("/checkout") ? "text-[#CD8567] font-medium" : "text-gray-700 hover:text-[#CD8567] transition-colors"}>
              Оформление
            </Link>
            <Link href="/#contacts" className={isActive("/#contacts") ? "text-[#CD8567] font-medium" : "text-gray-700 hover:text-[#CD8567] transition-colors"}>
              Контакты
            </Link>
          </nav>

          {/* Right side - Cart and Phone */}
          <div className="flex items-center space-x-4">
            <HeaderCart />
            
            {/* Phone number */}
            <a
              href="tel:+74951234567"
              className="hidden md:flex items-center space-x-2 text-[#CD8567] hover:text-[#B8714C] transition-colors"
              aria-label="Позвонить по телефону"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>+7 (495) 123-45-67</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#CD8567] hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden" role="navigation" aria-label="Mobile navigation">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/") ? "text-[#CD8567] bg-[#CD8567]/10" : "text-gray-700 hover:text-[#CD8567] hover:bg-gray-50"
                }`}
                onClick={closeMenu}
              >
                Главная
              </Link>
              <Link
                href="/catalog"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/catalog") ? "text-[#CD8567] bg-[#CD8567]/10" : "text-gray-700 hover:text-[#CD8567] hover:bg-gray-50"
                }`}
                onClick={closeMenu}
              >
                Каталог
              </Link>
              <Link
                href="/delivery"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/delivery") ? "text-[#CD8567] bg-[#CD8567]/10" : "text-gray-700 hover:text-[#CD8567] hover:bg-gray-50"
                }`}
                onClick={closeMenu}
              >
                Доставка
              </Link>
              <Link
                href="/checkout"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/checkout") ? "text-[#CD8567] bg-[#CD8567]/10" : "text-gray-700 hover:text-[#CD8567] hover:bg-gray-50"
                }`}
                onClick={closeMenu}
              >
                Оформление
              </Link>
              <a
                href="/#contacts"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/#contacts") ? "text-[#CD8567] bg-[#CD8567]/10" : "text-gray-700 hover:text-[#CD8567] hover:bg-gray-50"
                }`}
                onClick={closeMenu}
              >
                Контакты
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}