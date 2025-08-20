"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Minus,
  LogOut, 
  Package, 
  MessageSquare, 
  ShoppingCart,
  X,
  Save,
  Upload
} from "lucide-react";
import { 
  getAllProducts, 
  getAllOrders, 
  getAllContactMessages,
  type Product,
  type Order,
  type ContactMessage
} from "@/lib/api";
import { FlashMessage } from "@/app/components/ui/flash-message";

type TabType = "products" | "orders" | "contacts";

type EditProductForm = {
  titleRu: string;
  latinName: string;
  description: string;
  heightCm: number;
  slug: string;
  metaTitle: string;
  metaDescription: string;
};

export default function AdminPanel() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: string; id: string; name: string } | null>(null);
  const [flashMessage, setFlashMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [productForm, setProductForm] = useState<EditProductForm>({
    titleRu: "",
    latinName: "",
    description: "",
    heightCm: 0,
    slug: "",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    setHasMounted(true);
    
    // Check authentication
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [productsData, ordersData, contactsData] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllContactMessages(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setContacts(contactsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      setFlashMessage({ type: "error", message: "Ошибка загрузки данных" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/admin/login");
    setFlashMessage({ type: "success", message: "Вы вышли из админ-панели" });
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        titleRu: product.titleRu,
        latinName: product.latinName || "",
        description: product.description || "",
        heightCm: product.heightCm || 0,
        slug: product.slug || "",
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        titleRu: "",
        latinName: "",
        description: "",
        heightCm: 0,
        slug: "",
        metaTitle: "",
        metaDescription: "",
      });
    }
    setShowProductModal(true);
  };

  const openOrderModal = (order: Order) => {
    setEditingOrder(order);
    setShowOrderModal(true);
  };

  const openDeleteConfirm = (type: string, id: string, name: string) => {
    setDeletingItem({ type, id, name });
    setShowDeleteConfirm(true);
  };

  const handleProductSave = async () => {
    try {
      // Here you would typically call an API to save the product
      setFlashMessage({ type: "success", message: editingProduct ? "Товар обновлен" : "Товар создан" });
      setShowProductModal(false);
      loadData(); // Reload data
    } catch (error) {
      setFlashMessage({ type: "error", message: "Ошибка сохранения товара" });
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      // Here you would typically call an API to delete the item
      toast.success(`${deletingItem.type} удален`);
      setShowDeleteConfirm(false);
      loadData(); // Reload data
    } catch (error) {
      toast.error(`Ошибка удаления ${deletingItem.type.toLowerCase()}`);
    }
  };

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Загрузка админ-панели...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Админ-панель Флора Микс</h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "products", label: "Товары", icon: Package, count: products.length },
              { id: "orders", label: "Заказы", icon: ShoppingCart, count: orders.length },
              { id: "contacts", label: "Сообщения", icon: MessageSquare, count: contacts.length },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-[#CD8567] text-[#CD8567]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-lg text-gray-600">Загрузка данных...</div>
          </div>
        ) : (
          <div>
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Управление товарами</h2>
                  <Button onClick={() => openProductModal()} className="bg-[#CD8567] hover:bg-[#B8714C]">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить товар
                  </Button>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Товар
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Категория
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Высота
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mr-4">
                                  {product.images && product.images.length > 0 ? (
                                    <ImageWithFallback
                                      src={product.images[0].url || product.images[0].localPath || ""}
                                      alt={product.titleRu}
                                      fill
                                      className="object-cover"
                                      sizes="48px"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      🌱
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{product.titleRu}</div>
                                  <div className="text-sm text-gray-500">{product.latinName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.category?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.heightCm} см
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                             <div className="flex items-center space-x-2">
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => openProductModal(product)}
                                 >
                                   <Eye className="w-4 h-4" />
                                 </Button>
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => openProductModal(product)}
                                 >
                                   <Edit className="w-4 h-4" />
                                 </Button>
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => openDeleteConfirm("товар", product.id, product.titleRu)}
                                   className="text-red-600 border-red-200 hover:bg-red-50"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </Button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление заказами</h2>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Заказ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Клиент
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Статус
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Дата
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id.slice(0, 8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                                <div className="text-sm text-gray-500">{order.customer.email}</div>
                              </div>
                            </td>
                                                         <td className="px-6 py-4 whitespace-nowrap">
                               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                 order.status === "sent" ? "bg-blue-100 text-blue-800" :
                                 order.status === "paid" ? "bg-yellow-100 text-yellow-800" :
                                 order.status === "shipped" ? "bg-green-100 text-green-800" :
                                 order.status === "cancelled" ? "bg-red-100 text-red-800" :
                                 "bg-gray-100 text-gray-800"
                               }`}>
                                 {order.status === "sent" ? "Новый заказ" :
                                  order.status === "paid" ? "В доставке" :
                                  order.status === "shipped" ? "Доставлен" :
                                  order.status === "cancelled" ? "Отменён" :
                                  order.status}
                               </span>
                             </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openOrderModal(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === "contacts" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Сообщения от клиентов</h2>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            От
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Контакт
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Сообщение
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Дата
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contacts.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {contact.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contact.contact}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                              {contact.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(contact.createdAt).toLocaleDateString("ru-RU")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteConfirm("сообщение", contact.id, contact.name)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? "Редактировать товар" : "Добавить товар"}
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название на русском *
                    </label>
                    <Input
                      value={productForm.titleRu}
                      onChange={(e) => setProductForm(prev => ({ ...prev, titleRu: e.target.value }))}
                      placeholder="Название товара"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Латинское название
                    </label>
                    <Input
                      value={productForm.latinName}
                      onChange={(e) => setProductForm(prev => ({ ...prev, latinName: e.target.value }))}
                      placeholder="Latin name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Описание товара"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Высота (см)
                    </label>
                    <Input
                      type="number"
                      value={productForm.heightCm}
                      onChange={(e) => setProductForm(prev => ({ ...prev, heightCm: parseInt(e.target.value) || 0 }))}
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <Input
                      value={productForm.slug}
                      onChange={(e) => setProductForm(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="product-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <Input
                    value={productForm.metaTitle}
                    onChange={(e) => setProductForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="Meta title для SEO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <Textarea
                    value={productForm.metaDescription}
                    onChange={(e) => setProductForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="Meta description для SEO"
                    rows={2}
                  />
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изображения товара
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Button type="button" variant="outline">
                        Загрузить изображения
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Поддерживаются форматы: JPG, PNG, WebP
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowProductModal(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleProductSave}
                    className="bg-[#CD8567] hover:bg-[#B8714C]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order View Modal */}
      {showOrderModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Детали заказа #{editingOrder.id.slice(0, 8)}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Информация о клиенте</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Имя:</strong> {editingOrder.customer.name}</div>
                    <div><strong>Email:</strong> {editingOrder.customer.email}</div>
                    <div><strong>Телефон:</strong> {editingOrder.customer.phone}</div>
                    <div><strong>Комментарий:</strong> {editingOrder.customer.comment || "Не указан"}</div>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-3 mt-4">Адреса доставки</h4>
                  <div className="space-y-2">
                    {editingOrder.customer.addresses.map((address, index) => (
                      <div key={address.id} className="text-sm p-3 bg-gray-50 rounded">
                        <div><strong>Адрес {index + 1}:</strong></div>
                        <div>{address.line1}</div>
                        {address.line2 && <div>{address.line2}</div>}
                        <div>{address.city}, {address.region} {address.zip}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Детали заказа</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Статус:</strong> {editingOrder.status}</div>
                    <div><strong>Дата создания:</strong> {new Date(editingOrder.createdAt).toLocaleString("ru-RU")}</div>
                    <div><strong>Токен корзины:</strong> {editingOrder.cartTokenHash}</div>
                  </div>

                                     <h4 className="font-medium text-gray-900 mb-3 mt-4">Товары в заказе</h4>
                   <div className="space-y-2">
                     {editingOrder.items && editingOrder.items.length > 0 ? (
                       editingOrder.items.map((item, index) => (
                         <div key={index} className="text-sm p-3 bg-gray-50 rounded">
                           <div className="flex justify-between items-start">
                             <div>
                               <div className="font-medium">{item.product?.titleRu || 'Товар'}</div>
                               <div className="text-gray-600">{item.product?.latinName}</div>
                             </div>
                             <div className="text-right">
                               <div className="font-medium">Количество: {item.quantity}</div>
                               {item.product?.heightCm && (
                                 <div className="text-gray-600">{item.product.heightCm} см</div>
                               )}
                             </div>
                           </div>
                         </div>
                       ))
                     ) : (
                       <div className="text-gray-600">Товары не загружены</div>
                     )}
                   </div>
                </div>
              </div>

                             <div className="flex justify-end space-x-3 pt-4">
                 <Button
                   variant="outline"
                   onClick={() => setShowOrderModal(false)}
                 >
                   Закрыть
                 </Button>
                 <Button
                   onClick={() => {
                     setShowOrderModal(false);
                     setShowEditOrderModal(true);
                   }}
                   className="bg-[#CD8567] hover:bg-[#B8714C] text-white"
                 >
                   <Edit className="w-4 h-4 mr-2" />
                   Редактировать
                 </Button>
               </div>
            </div>
          </div>
        </div>
             )}

       {/* Edit Order Modal */}
       {showEditOrderModal && editingOrder && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-medium text-gray-900">
                   Редактирование заказа #{editingOrder.id.slice(0, 8)}
                 </h3>
                 <button
                   onClick={() => setShowEditOrderModal(false)}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h4 className="font-medium text-gray-900 mb-3">Информация о клиенте</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                       <Input value={editingOrder.customer.name} readOnly />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                       <Input value={editingOrder.customer.email} readOnly />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                       <Input value={editingOrder.customer.phone} readOnly />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                       <Textarea value={editingOrder.customer.comment || ""} readOnly />
                     </div>
                   </div>
                 </div>

                 <div>
                   <h4 className="font-medium text-gray-900 mb-3">Детали заказа</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                       <Select value={editingOrder.status} onValueChange={(value) => {}}>
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="sent">Новый заказ</SelectItem>
                           <SelectItem value="paid">В доставке</SelectItem>
                           <SelectItem value="shipped">Доставлен</SelectItem>
                           <SelectItem value="cancelled">Отменён</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Дата создания</label>
                       <Input value={new Date(editingOrder.createdAt).toLocaleString("ru-RU")} readOnly />
                     </div>
                   </div>

                   <h4 className="font-medium text-gray-900 mb-3 mt-4">Товары в заказе</h4>
                   <div className="space-y-2">
                     {editingOrder.items && editingOrder.items.length > 0 ? (
                       editingOrder.items.map((item, index) => (
                         <div key={index} className="text-sm p-3 bg-gray-50 rounded">
                           <div className="flex justify-between items-center">
                             <div>
                               <div className="font-medium">{item.product?.titleRu || 'Товар'}</div>
                               <div className="text-gray-600">{item.product?.latinName}</div>
                             </div>
                             <div className="flex items-center space-x-2">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {}}
                                 disabled={item.quantity <= 1}
                               >
                                 <Minus className="w-4 h-4" />
                               </Button>
                               <span className="w-12 text-center font-medium">{item.quantity}</span>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {}}
                               >
                                 <Plus className="w-4 h-4" />
                               </Button>
                             </div>
                           </div>
                         </div>
                       ))
                     ) : (
                       <div className="text-gray-600">Товары не загружены</div>
                     )}
                   </div>
                 </div>
               </div>

               <div className="flex justify-end space-x-3 pt-4">
                 <Button
                   variant="outline"
                   onClick={() => setShowEditOrderModal(false)}
                 >
                   Отмена
                 </Button>
                 <Button
                   onClick={() => {
                     // Save order changes
                     setShowEditOrderModal(false);
                   }}
                   className="bg-[#CD8567] hover:bg-[#B8714C] text-white"
                 >
                   <Save className="w-4 h-4 mr-2" />
                   Сохранить
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Подтвердите удаление
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Вы уверены, что хотите удалить {deletingItem.type.toLowerCase()} "{deletingItem.name}"? 
                Это действие нельзя отменить.
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}