"use client";

import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8337";

// Types based on API responses
export type Category = {
  id: string;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  imagePath?: string;
};

export type ProductImage = {
  id: string;
  storage: "external" | "local";
  url: string | null;
  localPath: string | null;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  category: Category;
  titleRu: string;
  latinName: string;
  description: string;
  heightCm: number;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  careMessage?: string;
  images: ProductImage[];
};

export type CategoryWithProducts = {
  id: string;
  name: string;
  slug: string;
  products: Product[];
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

export type Cart = {
  id: string;
  status: string;
  items: CartItem[];
  cartTokenHash: string;
};

export type CartResponse = {
  token: string;
  cart: Cart;
};

export type CartSingleResponse = {
  cart: Cart;
  cartToken: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Array<{
    id: string;
    line1: string;
    line2: string | null;
    city: string;
    region: string;
    zip: string;
  }>;
  comment: string;
};

export type Order = {
  id: string;
  customer: Customer;
  status: string;
  createdAt: string;
  items: CartItem[];
  cartTokenHash: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  contact: string;
  message: string;
  createdAt: string;
};

// Helper function for API calls with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown API error";
    toast.error(`API Error: ${message}`);
    throw error;
  }
}

// API functions
export async function getCategories(): Promise<Category[]> {
  return apiCall<Category[]>("/api/category");
}

export async function getCategoryWithProducts(categoryId: string): Promise<CategoryWithProducts> {
  return apiCall<CategoryWithProducts>(`/api/category/${categoryId}/product`);
}

export async function getProduct(productId: string): Promise<Product> {
  return apiCall<Product>(`/api/product/${productId}`);
}

export async function getAllProducts(): Promise<Product[]> {
  return apiCall<Product[]>("/api/product");
}

export async function getAllOrders(): Promise<Order[]> {
  return apiCall<Order[]>("/api/cart");
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  return apiCall<ContactMessage[]>("/api/contact");
}

// Cart system API functions
export async function createCart(): Promise<CartResponse> {
  return apiCall<CartResponse>("/api/cart", {
    method: "POST",
  });
}

export async function getCart(cartId: string, cartToken: string): Promise<CartSingleResponse> {
  return apiCall<CartSingleResponse>(`/api/cart/${cartId}/single`, {
    headers: {
      "X-Cart-Token": cartToken,
    },
  });
}

export async function addToCart(cartToken: string, productId: string, quantity: number): Promise<CartResponse> {
  return apiCall<CartResponse>(`/api/cart/items?productId=${productId}&quantity=${quantity}`, {
    method: "POST",
    headers: {
      "X-Cart-Token": cartToken,
    },
  });
}

export async function removeFromCart(cartToken: string, productId: string, quantity: number): Promise<CartResponse> {
  return apiCall<CartResponse>(`/api/cart/items?productId=${productId}&quantity=${quantity}`, {
    method: "DELETE",
    headers: {
      "X-Cart-Token": cartToken,
    },
  });
}

// Admin authentication
export async function adminLogin(email: string, password: string): Promise<{ token: string; refresh_token?: string }> {
  return apiCall<{ token: string; refresh_token?: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(refreshToken: string): Promise<{ token: string }> {
  return apiCall<{ token: string }>("/api/token/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

// Checkout
export async function createOrder(cartToken: string, orderData: {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  city: string;
  region: string;
  zip: string;
  comment?: string;
  pdnConsent: boolean;
}): Promise<any> {
  return apiCall<any>("/api/order/checkout", {
    method: "POST",
    headers: {
      "X-Cart-Token": cartToken,
    },
    body: JSON.stringify(orderData),
  });
}


