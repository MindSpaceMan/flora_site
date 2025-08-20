"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { useCart } from "@/store/cart";
import { createOrder } from "@/lib/api";
import { FlashMessage } from "@/app/components/ui/flash-message";

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  city: string;
  region: string;
  zip: string;
  comment: string;
  pdnConsent: boolean;
};

type Errors = Partial<Record<keyof CheckoutForm, string>>;

function validate(values: CheckoutForm): Errors {
  const errors: Errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Укажите имя получателя";
  } else if (values.fullName.length > 255) {
    errors.fullName = "Имя не может быть длиннее 255 символов";
  }

  if (!values.phone.trim()) {
    errors.phone = "Укажите телефон";
  } else if (!/^\d{10}$/.test(values.phone)) {
    errors.phone = "Укажите телефон в формате +7 (XXX) XXX-XX-XX";
  }

  if (!values.email.trim()) {
    errors.email = "Укажите email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Некорректный email";
  } else if (values.email.length > 255) {
    errors.email = "Email не может быть длиннее 255 символов";
  }

  if (!values.deliveryAddress.trim()) {
    errors.deliveryAddress = "Укажите адрес доставки";
  } else if (values.deliveryAddress.length > 1000) {
    errors.deliveryAddress = "Адрес не может быть длиннее 1000 символов";
  }

  if (!values.city.trim()) {
    errors.city = "Укажите город";
  } else if (values.city.length > 255) {
    errors.city = "Название города не может быть длиннее 255 символов";
  }

  if (!values.region.trim()) {
    errors.region = "Укажите регион";
  } else if (values.region.length > 255) {
    errors.region = "Название региона не может быть длиннее 255 символов";
  }

  if (!values.zip.trim()) {
    errors.zip = "Укажите индекс";
  } else if (values.zip.length > 255) {
    errors.zip = "Индекс не может быть длиннее 255 символов";
  }

  if (values.comment && values.comment.length > 2000) {
    errors.comment = "Комментарий не может быть длиннее 2000 символов";
  }

  if (!values.pdnConsent) {
    errors.pdnConsent = "Необходимо согласие на обработку персональных данных";
  }

  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clear } = useCart();
  const [hasMounted, setHasMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [values, setValues] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    city: "",
    region: "",
    zip: "",
    comment: "",
    pdnConsent: false,
  });

  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [flashMessage, setFlashMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [phoneDisplay, setPhoneDisplay] = useState("");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  // Phone number formatting
  const formatPhoneDisplay = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 3) return `+7 (${cleaned}`;
    if (cleaned.length <= 6) return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
  };

  const normalizeToCanonicalRu = (displayValue: string) => {
    const cleaned = displayValue.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return cleaned; // Return just the 10 digits without +7
    }
    return displayValue;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneDisplay(input);
    setPhoneDisplay(formatted);
    
    const canonical = normalizeToCanonicalRu(formatted);
    setValues(prev => ({ ...prev, phone: canonical }));
    
    if (touched.phone) {
      const newErrors = validate({ ...values, phone: canonical });
      setErrors(prev => ({ ...prev, phone: newErrors.phone }));
    }
  };

  useEffect(() => {
    if (phoneDisplay && !touched.phone) {
      setPhoneDisplay(formatPhoneDisplay(values.phone));
    }
  }, [values.phone, touched.phone]);

  const onChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const newErrors = validate({ ...values, [field]: value });
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const onBlur = (field: keyof CheckoutForm) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validate(values);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
  };

  const showError = (field: keyof CheckoutForm) => {
    return (touched[field] || submitted) && errors[field];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setFlashMessage({ type: "error", message: "Пожалуйста, исправьте ошибки в форме" });
      return;
    }

    try {
      setSubmitting(true);
      
      // Generate a cart token (in real app, this would come from cart state)
      const cartToken = "demo-cart-token-" + Date.now();
      
      await createOrder(cartToken, values);
      
      setFlashMessage({ type: "success", message: "Заказ успешно оформлен!" });
      clear();
      router.push("/");
    } catch (error) {
      console.error("Checkout error:", error);
      setFlashMessage({ type: "error", message: "Ошибка при оформлении заказа. Попробуйте еще раз." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasMounted) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-medium mb-4">Загрузка страницы оформления...</h1>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-medium mb-4">Корзина пуста</h1>
        <p className="text-gray-600 mb-4">Добавьте товары в корзину для оформления заказа.</p>
        <Button onClick={() => router.push("/catalog")}>
          Перейти в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-medium text-gray-800 mb-6">Оформление заказа</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
              {/* Left: Form */}
              <form onSubmit={onSubmit} className="grid gap-4 max-w-3xl lg:max-w-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ФИО получателя *
                    </label>
                    <Input
                      value={values.fullName}
                      onChange={(e) => onChange("fullName", e.target.value)}
                      onBlur={() => onBlur("fullName")}
                      placeholder="Иван Петров"
                      className={showError("fullName") ? "border-red-500" : ""}
                    />
                    {showError("fullName") && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон *
                    </label>
                    <Input
                      value={phoneDisplay}
                      onChange={handlePhoneChange}
                      onBlur={() => onBlur("phone")}
                      placeholder="+7 (XXX) XXX-XX-XX"
                      className={showError("phone") ? "border-red-500" : ""}
                    />
                    {showError("phone") && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={values.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    onBlur={() => onBlur("email")}
                    placeholder="ivan@example.com"
                    className={showError("email") ? "border-red-500" : ""}
                  />
                  {showError("email") && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Адрес доставки *
                  </label>
                  <Textarea
                    value={values.deliveryAddress}
                    onChange={(e) => onChange("deliveryAddress", e.target.value)}
                    onBlur={() => onBlur("deliveryAddress")}
                    placeholder="ул. Цветочная, д. 5, кв. 10"
                    rows={3}
                    className={showError("deliveryAddress") ? "border-red-500" : ""}
                  />
                  {showError("deliveryAddress") && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Город *
                    </label>
                    <Input
                      value={values.city}
                      onChange={(e) => onChange("city", e.target.value)}
                      onBlur={() => onBlur("city")}
                      placeholder="Симферополь"
                      className={showError("city") ? "border-red-500" : ""}
                    />
                    {showError("city") && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Регион *
                    </label>
                    <Input
                      value={values.region}
                      onChange={(e) => onChange("region", e.target.value)}
                      onBlur={() => onBlur("region")}
                      placeholder="Крым"
                      className={showError("region") ? "border-red-500" : ""}
                    />
                    {showError("region") && (
                      <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Индекс *
                    </label>
                    <Input
                      value={values.zip}
                      onChange={(e) => onChange("zip", e.target.value)}
                      onBlur={() => onBlur("zip")}
                      placeholder="12345"
                      className={showError("zip") ? "border-red-500" : ""}
                    />
                    {showError("zip") && (
                      <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Комментарий к заказу
                  </label>
                  <Textarea
                    value={values.comment}
                    onChange={(e) => onChange("comment", e.target.value)}
                    onBlur={() => onBlur("comment")}
                    placeholder="Дополнительная информация о заказе"
                    rows={3}
                    className={showError("comment") ? "border-red-500" : ""}
                  />
                  {showError("comment") && (
                    <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                  )}
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={values.pdnConsent}
                    onChange={(e) => onChange("pdnConsent", e.target.checked)}
                    onBlur={() => onBlur("pdnConsent")}
                  />
                  <span>Согласие на обработку персональных данных</span>
                </label>
                {showError("pdnConsent") && (
                  <p className="-mt-2 text-sm text-red-600">{errors.pdnConsent}</p>
                )}

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="bg-[#CD8567] hover:bg-[#B8714C] w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Оформление заказа..." : "Отправить заказ"}
                  </Button>
                </div>
              </form>

              {/* Right: Cart Summary */}
              <div className="bg-white rounded-xl border border-[#CD8567]/10 p-4 sm:p-6 h-fit">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-[#4A3A2B]">Ваш заказ</h2>
                  {cartItems.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clear}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Очистить
                    </Button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-gray-600">Корзина пуста.</p>
                ) : (
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.image ? (
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              🌱
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">Количество: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Всего товаров</span>
                    <span className="text-lg font-semibold">{cartItems.reduce((sum, item) => sum + item.qty, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Flash Message */}
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}
    </div>
  );
}
