"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartDemo } from "../state";

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

  const notBlank = (v: string) => v.trim().length > 0;
  const lenMax = (v: string, max: number) => v.length <= max;

  if (!notBlank(values.fullName)) errors.fullName = "Укажите имя получателя";
  else if (!lenMax(values.fullName, 255)) errors.fullName = "Максимум 255 символов";

  const phoneRegex = /^\+7\d{10}$/;
  if (!notBlank(values.phone)) errors.phone = "Укажите телефон";
  else if (!phoneRegex.test(values.phone)) errors.phone = "Укажите телефон в формате +7 (XXX) XXX-XX-XX или 8 XXX XXX-XX-XX";
  else if (!lenMax(values.phone, 50)) errors.phone = "Максимум 50 символов";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!notBlank(values.email)) errors.email = "Укажите email";
  else if (!emailRegex.test(values.email)) errors.email = "Некорректный email";
  else if (!lenMax(values.email, 255)) errors.email = "Максимум 255 символов";

  if (!notBlank(values.deliveryAddress)) errors.deliveryAddress = "Укажите адрес доставки";
  else if (!lenMax(values.deliveryAddress, 1000)) errors.deliveryAddress = "Максимум 1000 символов";

  if (!notBlank(values.city)) errors.city = "Укажите город";
  else if (!lenMax(values.city, 255)) errors.city = "Максимум 255 символов";

  if (!notBlank(values.region)) errors.region = "Укажите регион";
  else if (!lenMax(values.region, 255)) errors.region = "Максимум 255 символов";

  if (!notBlank(values.zip)) errors.zip = "Укажите индекс";
  else if (!lenMax(values.zip, 255)) errors.zip = "Максимум 255 символов";

  if (!values.pdnConsent) errors.pdnConsent = "Необходимо согласие на обработку персональных данных";

  if (!lenMax(values.comment ?? "", 2000)) errors.comment = "Максимум 2000 символов";

  return errors;
}

export default function Page() {
  const { items, setQty, remove, clear, totalCount, hydrated, removingId } = useCartDemo();
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState("");

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const onBlur = (name: keyof CheckoutForm) => setTouched((t) => ({ ...t, [name]: true }));

  const onChange = (
    name: keyof CheckoutForm,
    value: string | boolean
  ) => setValues((v) => ({ ...v, [name]: value as never }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    // Имитация отправки: подготовим payload под backend
    const payload = {
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      deliveryAddress: values.deliveryAddress,
      city: values.city,
      region: values.region,
      zip: values.zip,
      comment: values.comment || null,
      pdnConsent: values.pdnConsent,
    };
    console.log("CHECKOUT_PAYLOAD", payload);
    alert("Данные валидны и готовы к отправке на сервер.");
  };

  const showError = (name: keyof CheckoutForm) => (touched[name] || submitted) && errors[name];

  // --- RU phone mask helpers ---
  function formatPhoneDisplay(canonical: string): string {
    // canonical should be "+7XXXXXXXXXX" or empty
    if (!canonical.startsWith("+7") || canonical.length < 2) return "+7";
    const digits = canonical.slice(2); // 10 digits maybe partial
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 8);
    const p4 = digits.slice(8, 10);
    let out = "+7";
    if (p1.length) out += ` (${p1}`;
    if (p1.length === 3) out += ")";
    if (p2.length) out += ` ${p2}`;
    if (p3.length) out += `-${p3}`;
    if (p4.length) out += `-${p4}`;
    return out;
  }

  function normalizeToCanonicalRu(input: string): string {
    // Keep only digits; coerce leading 8 to 7; ensure +7 prefix; cap local part to 10 digits
    let digits = input.replace(/\D+/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    // If first isn't 7 but user typed local (e.g. 9...), prepend 7
    if (!digits.startsWith("7") && digits.length > 0) {
      digits = "7" + digits;
    }
    // Slice to country 7 + 10 local digits max
    const country = digits.startsWith("7") ? "7" : "";
    const local = digits.startsWith("7") ? digits.slice(1, 11) : digits.slice(0, 10);
    return country ? "+7" + local : "+7" + local;
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const canonical = normalizeToCanonicalRu(e.target.value);
    setValues((v) => ({ ...v, phone: canonical }));
    setPhoneDisplay(formatPhoneDisplay(canonical));
  }

  // keep display in sync if values.phone changed elsewhere (not expected here)
  useEffect(() => {
    if (!values.phone) {
      setPhoneDisplay("+7");
    }
  }, [values.phone]);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-medium text-gray-800 mb-6">Оформление заказа (демо)</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <form onSubmit={onSubmit} className="grid gap-4 md:col-span-2 order-1">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Имя получателя</label>
                  <Input
                    value={values.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    onBlur={() => onBlur("fullName")}
                    placeholder="Иван Иванов"
                  />
                  {showError("fullName") && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Телефон</label>
                    <Input
                      value={phoneDisplay || "+7"}
                      onChange={handlePhoneChange}
                      onBlur={() => onBlur("phone")}
                      placeholder={"+7 (XXX) XXX-XX-XX"}
                      inputMode="numeric"
                    />
                    {showError("phone") && (
                      <p className="mt-1 text см text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <Input
                      value={values.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      onBlur={() => onBlur("email")}
                      placeholder="name@example.com"
                    />
                    {showError("email") && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Адрес доставки</label>
                  <Textarea
                    value={values.deliveryAddress}
                    onChange={(e) => onChange("deliveryAddress", e.target.value)}
                    onBlur={() => onBlur("deliveryAddress")}
                    placeholder="Улица, дом, квартира"
                  />
                  {showError("deliveryAddress") && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Город</label>
                    <Input
                      value={values.city}
                      onChange={(e) => onChange("city", e.target.value)}
                      onBlur={() => onBlur("city")}
                    />
                    {showError("city") && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Регион</label>
                    <Input
                      value={values.region}
                      onChange={(e) => onChange("region", e.target.value)}
                      onBlur={() => onBlur("region")}
                    />
                    {showError("region") && (
                      <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Индекс</label>
                    <Input
                      value={values.zip}
                      onChange={(e) => onChange("zip", e.target.value)}
                      onBlur={() => onBlur("zip")}
                      placeholder="123456"
                    />
                    {showError("zip") && (
                      <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Комментарий (необязательно)</label>
                  <Textarea
                    value={values.comment}
                    onChange={(e) => onChange("comment", e.target.value)}
                    onBlur={() => onBlur("comment")}
                    placeholder="Пожелания к доставке"
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
                  <Button type="submit" className="bg-[#CD8567] hover:bg-[#B8714C] w-full md:w-auto">
                    Отправить заказ
                  </Button>
                </div>
              </form>

              <aside className="md:col-span-1 order-2">
                <div className="bg-white rounded-2xl border border-[#CD8567]/10 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-medium text-[#4A3A2B]">Корзина</h2>
                    <Button
                      variant="outline"
                      onClick={clear}
                      className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2"
                    >
                      Очистить
                    </Button>
                  </div>

                  {!hydrated ? (
                    <p className="text-gray-500">Загрузка корзины...</p>
                  ) : items.length === 0 ? (
                    <p className="text-gray-500">Корзина пуста</p>
                  ) : (
                    <div className="divide-y">
                      {items.map((i) => (
                        <div key={i.id} className={`py-3 flex items-center gap-3 ${removingId === i.id ? "opacity-50" : ""}`}>
                          <div className="shrink-0">
                            <ImageWithFallback
                              src={i.image ?? "https://via.placeholder.com/48x48?text=No+Image"}
                              alt={i.name}
                              width={48}
                              height={48}
                              sizes="48px"
                              className="rounded object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#4A3A2B] line-clamp-1">{i.name}</div>
                            <div className="text-xs text-gray-500">ID: {i.id}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 grid place-items-center"
                              onClick={() => setQty(i.id, i.qty - 1)}
                              aria-label="Уменьшить"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="w-10 text-center">{i.qty}</div>
                            <button
                              className="w-8 h-8 rounded border border-[#CD8567]/20 hover:bg-[#CD8567]/5 grid place-items-center"
                              onClick={() => setQty(i.id, i.qty + 1)}
                              aria-label="Увеличить"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            className="ml-1 text-red-600 hover:text-red-700 p-2"
                            onClick={() => remove(i.id)}
                            aria-label="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                    <span>Всего товаров</span>
                    <span className="font-medium">{totalCount}</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


