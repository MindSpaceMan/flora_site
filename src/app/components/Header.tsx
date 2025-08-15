"use client"

import { Menu, X, Phone } from 'lucide-react';
import { Button } from "./ui/button";
import { useState, useCallback } from 'react';
import { useCart } from "@/store/cart";
import HeaderCart from "./HeaderCart";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation items to avoid duplication
const navigationItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/delivery", label: "Доставка" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const isActive = (href: string) => {
    if (href === "/#contacts") {
      return pathname === "/" && window.location.hash === "#contacts";
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#CD8567]/10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-2xl font-medium text-[#CD8567] hover:text-[#B8714C] transition-colors">
              Флора Микс
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`transition-colors ${
                    isActive(item.href)
                      ? "text-[#CD8567]" 
                      : "text-gray-700 hover:text-[#CD8567]"
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ) : (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`transition-colors ${
                    isActive(item.href)
                      ? "text-[#CD8567]" 
                      : "text-gray-700 hover:text-[#CD8567]"
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <a 
              href="tel:+74951234567" 
              className="hidden md:flex items-center space-x-2 text-[#CD8567] hover:text-[#B8714C] transition-colors"
              aria-label="Позвонить по телефону"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>+7 (495) 123-45-67</span>
            </a>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#CD8567] text-[#CD8567] hover:bg-[#CD8567] hover:text-white relative"
              asChild
            >
              <HeaderCart />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            className="md:hidden mt-4 pb-4 border-t pt-4" 
            role="navigation" 
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`transition-colors ${
                      isActive(item.href)
                        ? "text-[#CD8567]" 
                        : "text-gray-700 hover:text-[#CD8567]"
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className={`transition-colors ${
                      isActive(item.href)
                        ? "text-[#CD8567]" 
                        : "text-gray-700 hover:text-[#CD8567]"
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <a 
                href="tel:+74951234567" 
                className="flex items-center space-x-2 text-[#CD8567] hover:text-[#B8714C] transition-colors"
                onClick={closeMenu}
                aria-label="Позвонить по телефону"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>+7 (495) 123-45-67</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}