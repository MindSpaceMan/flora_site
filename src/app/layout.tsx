import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Toaster } from "@/app/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = { title: "Flora", description: "Flora site" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className="h-full">
        <body className="min-h-dvh bg-white antialiased">
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" richColors />
        </body>
        </html>
    );
}

