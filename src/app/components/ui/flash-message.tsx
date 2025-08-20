"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface FlashMessageProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function FlashMessage({ 
  message, 
  type = "success", 
  duration = 5000, 
  onClose 
}: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-green-500 text-white border-green-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <X className="w-5 h-5" />;
      case "info":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${getTypeStyles()} rounded-lg shadow-2xl border-2 px-6 py-4 min-w-80 max-w-md flex items-center justify-between`}
        style={{
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-5">
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 flex-shrink-0 text-white/80 hover:text-white transition-colors duration-200"
          aria-label="Close message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
