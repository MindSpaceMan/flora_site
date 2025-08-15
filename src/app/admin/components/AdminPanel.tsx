"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/app/components/ui/dialog";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  Search, Plus, Edit, Trash2, User, LogOut, Settings,
  Package, ShoppingCart, Filter, Download, Eye, Calendar, Phone, Mail
} from "lucide-react";

/* =========================
   Типы
========================= */
type ProductStatus = "active" | "draft";
type OrderStatus   = "new" | "processing" | "completed";
type ActiveTab = "products" | "orders";

/* =========================
   Данные (как у тебя)
========================= */
const mockProducts = [
  {
    id: 1,
    name: "White Aurora",
    description: "Эустома махровая белая с крупными цветками",
    category: "Эустома",
    subcategory: "Махровые",
    photo: "https://images.unsplash.com/photo-1597848212624-e50d736d1dc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    color: "Белый",
    status: "active" as ProductStatus,
  },
  {
    id: 2,
    name: "Pink Dreams",
    description: "Розовые тюльпаны для весенней посадки",
    category: "Тюльпаны",
    subcategory: "Триумф",
    photo: "https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    color: "Розовый",
    status: "active" as ProductStatus,
  },
  {
    id: 3,
    name: "Golden Chrysanthemum",
    description: "Хризантемы золотистые крупноцветковые",
    category: "Хризантемы",
    subcategory: "Крупноцветковые",
    photo: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    color: "Желтый",
    status: "draft" as ProductStatus,
  },
];

const mockOrders = [
  {
    id: 1,
    customerName: "Анна Петрова",
    phone: "+7 (495) 123-45-67",
    email: "anna@example.com",
    comment: "Нужна доставка в выходные",
    date: "2024-01-15T10:30:00",
    items: ["White Aurora x2", "Pink Dreams x1"],
    status: "new" as OrderStatus,
    total: "2,670 ₽",
  },
  {
    id: 2,
    customerName: "Михаил Иванов",
    phone: "+7 (495) 987-65-43",
    email: "mikhail@example.com",
    comment: "Звонить только после 18:00",
    date: "2024-01-14T15:45:00",
    items: ["Golden Chrysanthemum x3"],
    status: "processing" as OrderStatus,
    total: "1,890 ₽",
  },
  {
    id: 3,
    customerName: "Елена Сидорова",
    phone: "+7 (495) 555-12-34",
    email: "elena@example.com",
    comment: "",
    date: "2024-01-13T09:15:00",
    items: ["White Aurora x1", "Pink Dreams x2", "Golden Chrysanthemum x1"],
    status: "completed" as OrderStatus,
    total: "3,450 ₽",
  },
];

/* =========================
   Хелперы
========================= */
function getStatusBadge(status: ProductStatus | OrderStatus) {
  const statusConfig = {
    active:     { label: "Активен",      variant: "default" as const },
    draft:      { label: "Черновик",     variant: "secondary" as const },
    new:        { label: "Новый",        variant: "destructive" as const },
    processing: { label: "В обработке",  variant: "default" as const },
    completed:  { label: "Выполнен",     variant: "secondary" as const },
  } as const;

  const config = statusConfig[status] ?? statusConfig.draft;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================
   Страница
========================= */
export function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab]   = useState<ActiveTab>("products");

  const normalized = searchTerm.trim().toLowerCase();

  const filteredProducts = normalized
      ? mockProducts.filter((p) =>
          [p.name, p.description, p.category, p.subcategory, p.color]
              .join(" ")
              .toLowerCase()
              .includes(normalized),
      )
      : mockProducts;

  const filteredOrders = normalized
      ? mockOrders.filter((o) =>
          [o.customerName, o.phone, o.email, o.items.join(" "), o.comment, o.total]
              .join(" ")
              .toLowerCase()
              .includes(normalized),
      )
      : mockOrders;

  return (
      <div className="min-h-screen bg-[#FDF8F5]">
        {/* Header */}
        <header className="bg-white border-b border-[#CD8567]/10 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#CD8567] rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium text-[#4A3A2B]">Флора Микс</h1>
                  <p className="text-sm text-gray-500">Административная панель</p>
                </div>
              </div>
            </div>

            {/* Admin Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Администратор"
                    />
                    <AvatarFallback className="bg-[#CD8567] text-white">АД</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">Администратор</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">admin@gardens-dawn.ru</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Профиль</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Настройки</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as ActiveTab)}
              className="space-y-6"
          >
            {/* Tab Navigation */}
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-2 bg-white border border-[#CD8567]/10">
                <TabsTrigger value="products" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Товары</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Заказы</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                      placeholder="Поиск..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64 bg-white border-[#CD8567]/20"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-[#CD8567]/20">
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
                <Button variant="outline" size="sm" className="border-[#CD8567]/20">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-medium text-[#4A3A2B]">Управление товарами</h2>
                  <p className="text-gray-600">Управляйте каталогом семян, луковиц и рассады</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#CD8567] hover:bg-[#B8714C] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить товар
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Добавить новый товар</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input placeholder="Название товара" />
                      <Input placeholder="Категория" />
                      <Input placeholder="Подвид" />
                      <Input placeholder="Цвет" />
                      <Button className="w-full bg-[#CD8567] hover:bg-[#B8714C]">
                        Создать товар
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-white rounded-xl border border-[#CD8567]/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#FDF8F5] hover:bg-[#FDF8F5]">
                      <TableHead className="font-medium text-[#4A3A2B]">Фото</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Название</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Описание</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Категория</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Подвид</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Цвет</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Статус</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-[#FDF8F5]/50">
                          <TableCell>
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <ImageWithFallback
                                  src={product.photo}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  width={48}
                                  height={48}
                                  sizes="48px"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-[#4A3A2B]">{product.name}</TableCell>
                          <TableCell className="max-w-xs truncate text-gray-600">{product.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-[#CD8567]/30 text-[#CD8567]">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{product.subcategory}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full border border-gray-300 bg-white" />
                              <span className="text-gray-600">{product.color}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Просмотреть">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Редактировать">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" aria-label="Удалить">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-medium text-[#4A3A2B]">Управление заказами</h2>
                  <p className="text-gray-600">Отслеживайте и обрабатывайте заказы клиентов</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="destructive" className="px-3 py-1">2 новых заказа</Badge>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#CD8567]/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#FDF8F5] hover:bg-[#FDF8F5]">
                      <TableHead className="font-medium text-[#4A3A2B]">Заказчик</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Контакты</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Дата/Время</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Содержимое</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Сумма</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Комментарий</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Статус</TableHead>
                      <TableHead className="font-medium text-[#4A3A2B]">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-[#FDF8F5]/50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#CD8567]/10 text-[#CD8567]">
                                  {order.customerName.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-[#4A3A2B]">{order.customerName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{order.phone}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-32">{order.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(order.date)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                  <div key={index} className="text-sm text-gray-600 bg-[#FDF8F5] px-2 py-1 rounded">
                                    {item}
                                  </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-[#4A3A2B]">{order.total}</TableCell>
                          <TableCell>
                            <div className="max-w-32 truncate text-sm text-gray-600">
                              {order.comment || "—"}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Просмотреть">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Редактировать">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  );
}