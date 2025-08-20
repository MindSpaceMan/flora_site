"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "./components/AdminPanel";

export default function AdminPage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // Check authentication
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Проверка авторизации...</div>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}