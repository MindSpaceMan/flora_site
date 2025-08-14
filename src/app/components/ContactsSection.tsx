"use client"

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock, Flower, Trees, Leaf } from "lucide-react";
import { useState } from "react";

export function ContactsSection() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', contact: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contacts" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-800 mb-4">
            Контакты
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Свяжитесь с нами любым удобным способом
          </p>
          <p className="text-sm text-gray-500">
            семена, луковицы, рассада
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Beautiful Map Illustration */}
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-[#F4E4D6] via-[#CD8567] to-[#B8714C] rounded-2xl overflow-hidden relative">
              {/* Map background pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
                  {/* Grid pattern */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  {/* Main location marker */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Animated ripple effect */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2">ФлораМикс</h3>
                  <p className="text-sm opacity-90 mb-4">Симферополь, ул. Киевская, 25</p>
                  
                  {/* Decorative plants */}
                  <div className="flex justify-center space-x-4 mt-6">
                    <div className="flex flex-col items-center">
                      <Flower className="w-6 h-6 text-[#FFBFA0] mb-1" />
                      <div className="w-1 h-8 bg-[#FFBFA0]/60 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Trees className="w-6 h-6 text-[#FFBFA0] mb-1" />
                      <div className="w-1 h-8 bg-[#FFBFA0]/60 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Leaf className="w-6 h-6 text-[#FFBFA0] mb-1" />
                      <div className="w-1 h-8 bg-[#FFBFA0]/60 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-4 left-4">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              </div>

              {/* Subtle roads/paths */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <path 
                  d="M 50 150 Q 200 100 350 150" 
                  stroke="white" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.3"
                  strokeDasharray="5,5"
                />
                <path 
                  d="M 200 50 Q 200 150 200 250" 
                  stroke="white" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.3"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </div>

          {/* Contact Info & Form */}
          <div>
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-6">Контактная информация</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#CD8567] rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Телефон</p>
                    <a 
                      href="tel:+74951234567" 
                      className="text-[#CD8567] hover:text-[#B8714C] transition-colors"
                    >
                      +7 (495) 123-45-67
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#CD8567] rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a 
                      href="mailto:info@auroflora.ru" 
                      className="text-[#CD8567] hover:text-[#B8714C] transition-colors"
                    >
                      info@auroflora.ru
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#CD8567] rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Адрес</p>
                    <p className="text-gray-600">Симферополь, ул. Киевская, 25</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#CD8567] rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Режим работы</p>
                    <p className="text-gray-600">Ежедневно с 9:00 до 19:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#FDF8F5] rounded-2xl p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-6">Напишите нам</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-[#CD8567]/20 focus:border-[#CD8567] focus:ring-[#CD8567]"
                    required
                  />
                </div>
                
                <div>
                  <Input
                    name="contact"
                    placeholder="E-mail или телефон"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full border-[#CD8567]/20 focus:border-[#CD8567] focus:ring-[#CD8567]"
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    name="message"
                    placeholder="Ваше сообщение"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border-[#CD8567]/20 focus:border-[#CD8567] focus:ring-[#CD8567] resize-none"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white"
                >
                  Отправить сообщение
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}