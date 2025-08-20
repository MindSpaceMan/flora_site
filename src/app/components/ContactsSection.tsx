"use client"

import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Textarea} from "./ui/textarea";
import {Phone, Mail, Clock} from "lucide-react";
import {useState} from "react";
import Link from "next/link";
import {env} from "@/shared/config/environment"; // <— относительный импорт от src/app/components
import { FlashMessage } from "./ui/flash-message";

export function ContactsSection() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<null | "ok" | string>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12_000);

        try {
            const res = await fetch(`${env.apiLocalUrl}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    contact: formData.contact,
                    message: formData.message,
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Ошибка ${res.status}: ${res.statusText}${text ? ` — ${text}` : ""}`);
            }

            // успех
            setStatus("ok");
            setFormData({name: "", contact: "", message: ""});
        } catch (err: object) {
            setStatus(err?.message ?? "Не удалось отправить сообщение");
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
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
                <div className="text-center mb-16">
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

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Contact Information */}
                        <div className="flex flex-col justify-center">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-medium text-gray-800 mb-8 text-center lg:text-left">
                                        Контактная информация
                                    </h3>

                                    <div className="space-y-6">
                                        <div
                                            className="flex items-center space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                                            <div
                                                className="w-14 h-14 bg-[#CD8567] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-6 h-6 text-white"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-lg">Телефон</p>
                                                <a
                                                    href="tel:+74951234567"
                                                    className="text-[#CD8567] hover:text-[#B8714C] transition-colors text-lg"
                                                >
                                                    +7 (495) 123-45-67
                                                </a>
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                                            <div
                                                className="w-14 h-14 bg-[#CD8567] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-6 h-6 text-white"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-lg">Email</p>
                                                <a
                                                    href="mailto:info@auroflora.ru"
                                                    className="text-[#CD8567] hover:text-[#B8714C] transition-colors text-lg"
                                                >
                                                    info@auroflora.ru
                                                </a>
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                                            <div
                                                className="w-14 h-14 bg-[#CD8567] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 text-white"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-lg">Режим работы</p>
                                                <p className="text-gray-600 text-lg">Ежедневно с 9:00 до 19:00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="bg-gradient-to-br from-[#F4E4D6] to-[#CD8567] rounded-2xl p-8 text-center shadow-lg">
                                    <h4 className="text-xl font-medium text-white mb-3">Флора Микс</h4>
                                    <p className="text-white/90 text-base">Мы всегда на связи и готовы помочь вам с
                                        выбором растений</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="flex flex-col justify-center">
                            <div className="bg-[#FDF8F5] rounded-2xl p-10 shadow-xl">
                                <h3 className="text-2xl font-medium text-gray-800 mb-8 text-center">
                                    Напишите нам
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                                            Ваше имя
                                        </label>
                                        <Input suppressHydrationWarning
                                            id="name"
                                            name="name"
                                            placeholder="Введите ваше имя"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border-[#CD8567]/20 focus:border-[#CD8567] focus:ring-[#CD8567] transition-colors h-12 text-base"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contact"
                                               className="block text-sm font-medium text-gray-700 mb-3">
                                            Контактные данные
                                        </label>
                                        <Input suppressHydrationWarning
                                            id="contact"
                                            name="contact"
                                            placeholder="E-mail или телефон"
                                            value={formData.contact}
                                            onChange={handleChange}
                                            className="w-full border-[#CD8567]/20 focus:border-[#CD8567] focus:ring-[#CD8567] transition-colors h-12 text-base"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message"
                                               className="block text-sm font-medium text-gray-700 mb-3">
                                            Сообщение
                                        </label>
                                        <Textarea suppressHydrationWarning
                                            id="message"
                                            name="message"
                                            placeholder="Расскажите, что вас интересует"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full border-[#CD8567]/20 focus:border-[#CD8567] focus:ring-[#CD8567] resize-none transition-colors text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input suppressHydrationWarning
                                                type="checkbox"
                                                name="pdnConsent"
                                                required
                                                className="mt-1 w-4 h-4 text-[#CD8567] bg-white border-[#CD8567]/30 rounded focus:ring-[#CD8567] focus:ring-2 transition-colors"
                                            />
                                            <span className="text-sm text-gray-600 leading-relaxed">
                        Отправляя форму, я подтверждаю, что ознакомлен(а) с{" "}
                                                <Link href="/privacy"
                                                      className="text-[#CD8567] hover:text-[#B8714C] underline transition-colors">
                          Политикой конфиденциальности «Флора Микс»
                        </Link>{" "}
                                                и даю согласие на обработку моих персональных данных для оформления и доставки заказа.
                      </span>
                                        </label>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#CD8567] hover:bg-[#B8714C] text-white py-4 text-lg font-medium transition-colors mt-6 disabled:opacity-60"
                                    >
                                        {loading ? "Отправляю…" : "Отправить сообщение"}
                                    </Button>

                                    {status && status !== "ok" && (
                                        <p aria-live="polite" className="text-red-600">
                                            {status}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flash Message */}
            {status === "ok" && (
                <FlashMessage
                    message="Письмо отправлено, скоро руководитель Вам ответит. Спасибо!"
                    type="success"
                    onClose={() => setStatus(null)}
                />
            )}
        </section>
    );
}
